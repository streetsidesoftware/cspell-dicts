import subprocess
import sys
import traceback
import re
import itertools
import os

from pycparser import c_ast, parse_file
from pathlib import Path
from platform import system
from multiprocessing import Pool

class DefNamesVisitor(c_ast.NodeVisitor):
    decls = []

    def add_name(self, name):
        assert(name != None)
        self.decls.append(name)

    def visit_Decl(self, node):
        if node.name != None:
            self.add_name(node.name)

    def visit_FuncDef(self, node):
        self.add_name(node.decl.name)

    def visit_Typedef(self, node):
        self.add_name(node.name)

    def visit_Struct(self, node):
        self.add_name(node.name)

        if node.decls != None:
            for decl in node.decls:
                if decl.name != None:
                    self.add_name(decl.name)

def flatten(array):
    return list(itertools.chain.from_iterable(array))

def expand(line):
    # Do camelCase/PascalCase expansion
    matches = re.findall(r'.+?(?:(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|$)', line)
    # Split snake_case strings
    matches = flatten([term.split("_") for term in matches])
    # Split around numbers
    matches = flatten([re.split(r'[0-9]+', term) for term in matches])

    return [term.lower() for term in matches if len(term) > 3 and not term.isnumeric()]

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

    sdk_dir = os.environ.get("UniversalCRTSdkDir")
    ucrt_version = os.environ.get("UCRTVersion")
    include_dir = f"{sdk_dir}\\Include\\{ucrt_version}"

    print(f"Found Windows SDK include path at {include_dir}. Parsing header files...")

    with Pool() as pool:
        result = flatten(pool.imap_unordered(collect_defines, Path(include_dir).rglob("*.h"), 8))

    return result

if __name__ == "__main__":
    if len(sys.argv) > 1:
        filename  = sys.argv[1]
    else:
        filename = 'input.h'

    if system() != "Windows":
        print("This generator script requires a Windows operating system.")
        exit(1)

    if os.environ.get("UniversalCRTSdkDir") == None:
        print("Missing %UniversalCRTSdkDir% environment variable. Please run this script from a Visual Studio Developer Command Prompt (more info at https://docs.microsoft.com/en-us/visualstudio/ide/reference/command-prompt-powershell?view=vs-2019)")
        exit(1)
    if os.environ.get("UCRTVersion") == None:
        print("Missing %UCRTVersion% environment variable. Please run this script from a Visual Studio Developer Command Prompt (more info at https://docs.microsoft.com/en-us/visualstudio/ide/reference/command-prompt-powershell?view=vs-2019)")
        exit(1)

    filename_postprocess = f"{filename}.output"
    target_file = 'win32.txt'
    # If `True`, generated .h.output file maintains original file/line locations of declarations with #line directives.
    # Settings to `False` can help diagnose problems with pycparser by inspecting the .h.output file at the location of each error.
    keep_original_filenames_in_output = True

    defines = [
        # -D defines now reside in test.h, as this allows definition of function-like macros.
    ]

    args = [
        f"-D{d}" for d in defines
    ]
    args.extend([
        "/E" if keep_original_filenames_in_output else "/EP",
        "/Za",
        "/Zc:wchar_t"
    ])

    print("Running cl...")

    text = subprocess.check_output(["cl"] + args + [filename])

    # Replace form-feed control character (\f, or \x0c) that might pop up in Windows' headers
    print("Removing form-feed characters...")
    text = text.replace(b"\x0c", b"")

    print(f"Writing to {filename_postprocess}...")

    with open(filename_postprocess, 'wb') as f:
        f.truncate(0)
        f.write(text)

    try:
        print(f"Parsing {filename_postprocess}...")

        ast = parse_file(filename_postprocess, use_cpp=False)

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
