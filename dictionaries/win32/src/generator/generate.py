import argparse
import itertools
import os
import re
import subprocess
import traceback

from typing import List, Tuple
from pathlib import Path
from platform import system
from pycparser import c_ast, parse_file
from multiprocessing import Pool

class DefNamesVisitor(c_ast.NodeVisitor):
    decls = []

    def add_name(self, name):
        assert(name != None)
        self.decls.append(name)

    def visit_Decl(self, node):
        if node.name != None:
            self.add_name(node.name)
        c_ast.NodeVisitor.generic_visit(self, node)

    def visit_FuncDef(self, node):
        self.add_name(node.decl.name)

    def visit_Typedef(self, node):
        self.add_name(node.name)
        c_ast.NodeVisitor.generic_visit(self, node)

    def visit_Enumerator(self, node):
        self.add_name(node.name)

    def visit_Struct(self, node):
        if node.name != None:
            self.add_name(node.name)
        c_ast.NodeVisitor.generic_visit(self, node)

def flatten(array):
    return list(itertools.chain.from_iterable(array))

def expand(line):
    # Do camelCase/PascalCase expansion
    matches = re.findall(r'.+?(?:(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|$)', line)
    # Split snake_case strings
    matches = flatten([term.split("_") for term in matches])
    # Split around numbers
    matches = flatten([re.split(r'[0-9]+', term) for term in matches])

    return [term for term in matches if len(term) > 3 and not term.isnumeric()]

def process(lines):
    result = set([])
    for line in lines:
        for term in expand(line):
            result.add(term)

    return sorted(result)

def collect_defines(path):
    result = []

    with open(path, 'r') as file:
        for line in file:
            stript = line.strip()

            # Parse identifier after "#define"
            match = re.search(r'^\s*#define\s+([a-zA-Z_$][0-9a-zA-Z_$]*)', stript)
            if match == None:
                continue

            result.append(match.group(1))

    return result

def collect_all_defines():
    result = []

    sdk_dir = Path(os.environ.get("UniversalCRTSdkDir"))
    ucrt_version = Path(os.environ.get("UCRTVersion"))
    include_dir = sdk_dir.joinpath("Include", ucrt_version)

    print(f"Found Windows SDK include path at {include_dir.resolve()}. Parsing header files...")

    with Pool() as pool:
        result = flatten(pool.imap_unordered(collect_defines, Path(include_dir).rglob("*.h"), 8))

    return result

def verify_repeated_includes(filepath: Path):
    includes: dict[str, int] = dict()

    # matches #include <...> and #include "..."
    pattern = re.compile(r'^\s*#include\s+(?:(?:<([^>]+)>)|(?:"([^"]+)"))')

    with open(filepath, 'r') as file:
        for (line_num, line) in enumerate(file):
            line_num += 1

            stript = line.strip()
            match = pattern.match(stript)

            if match == None:
                continue

            name = match.group(1)
            if name == None:
                name = match.group(2)

            previous = includes.get(name)
            if previous != None:
                print(f"Warning: Duplicate #include of file {name} in {filepath.name}:{line_num}: previous #include in {filepath.name}:{previous}")

            includes[name] = line_num

    return

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Generates a new win32.txt by probing MSVC compiler and sweeping public header files from Windows SDK.')

    parser.add_argument('--file', dest='file_name', type=Path,
                        default="input.h", help="File to use to generate a preprocessed file to parse with pycparser. Defaults to 'input.h'")
    parser.add_argument('-s', '--strip-line-directives', action='store_true',
                        help='Whether to instruct the MSVC compiler to strip #line directives that are used for diagnostics purposes. Setting this flag can help diagnose problems with pycparser by inspecting the .h.output file at the location of each error.')

    args = parser.parse_args()

    filepath: Path = args.file_name
    strip_line_directives = args.strip_line_directives

    if system() != "Windows":
        print("This generator script requires a Windows operating system.")
        exit(1)

    if os.environ.get("UniversalCRTSdkDir") == None:
        print("Missing %UniversalCRTSdkDir% environment variable. Please run this script from a Visual Studio Developer Command Prompt (more info at https://docs.microsoft.com/en-us/visualstudio/ide/reference/command-prompt-powershell?view=vs-2019)")
        exit(1)
    if os.environ.get("UCRTVersion") == None:
        print("Missing %UCRTVersion% environment variable. Please run this script from a Visual Studio Developer Command Prompt (more info at https://docs.microsoft.com/en-us/visualstudio/ide/reference/command-prompt-powershell?view=vs-2019)")
        exit(1)

    filepath_postprocess = filepath.with_suffix(f"{filepath.suffix}.output")
    target_file = 'win32.txt'

    # Check and warn about any repeated #include of the same file
    verify_repeated_includes(filepath)

    defines = [
        # -D defines now reside in test.h, as this allows definition of function-like macros.
    ]

    args = [
        f"-D{d}" for d in defines
    ]
    args.extend([
        "/EP" if strip_line_directives else "/E",
        "/Za",
        "/Zc:wchar_t"
    ])

    print("Running cl...")

    text = subprocess.check_output(["cl"] + args + [str(filepath.resolve())])

    # Replace form-feed control character (\f, or \x0c) that might pop up in Windows' headers
    print("Removing form-feed characters...")
    text = text.replace(b"\x0c", b"")

    print(f"Writing to {filepath_postprocess.name}...")

    with open(filepath_postprocess, 'wb') as f:
        f.truncate(0)
        f.write(text)

    try:
        print(f"Parsing {filepath_postprocess.name}...")

        ast = parse_file(filepath_postprocess.resolve(), use_cpp=False)

        print("Parsing succeeded! Collecting parsed declarations...")

        visitor = DefNamesVisitor()
        visitor.visit(ast)

        lines = visitor.decls

        print("Collecting succeeded! Collecting #define declarations...")

        lines.extend(collect_all_defines())

        print(f"Collecting succeeded! Processing results...")

        lines = process(lines)

        print(f"Processing succeeded! Writing results to {target_file}...")

        with open(target_file, 'w') as f:
            f.truncate(0)
            for line in lines:
                f.write(f"{line}\n")

        print("Success!")
    except:
        print(traceback.format_exc())
