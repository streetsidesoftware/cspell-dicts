import subprocess
import sys
import traceback
import re

from pycparser import c_ast, parse_file

class DefNamesVisitor(c_ast.NodeVisitor):
    decls = []

    def add_name(self, name):
        self.decls.append(name)

    def visit_FuncDef(self, node):
        self.add_name(node.decl.name)

    def visit_Typedef(self, node):
        self.add_name(node.name)

    def visit_Struct(self, node):
        self.add_name(node.name)

        if node.decls != None:
            for decl in node.decls:
                self.add_name(decl.name)

def expand(line):
    # Do camelCase/PascalCase/snake_case expansion
    matches = re.findall(r'[a-z]+|[0-9]+|(?:[A-Z][a-z]+)|(?:[A-Z]+(?=(?:[A-Z][a-z])|[^AZa-z]|[$\d\n]))', line)
    return [term for term in matches if len(term) > 3 and not term.isnumeric()]

def process(lines):
    result = []
    for line in lines:
        result.extend(expand(line))

    return sorted(list(set(result)))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        filename  = sys.argv[1]
    else:
        filename = 'input.h'

    filename_postprocess = f"{filename}.output"

    defines = [
        # -D defines now reside in test.h, as this allows definition of function-like macros.
    ]

    args = [
        f"-D{d}" for d in defines
    ]
    args.extend([
        "/E", "/Za", "/Zc:wchar_t"
    ])

    text = subprocess \
        .check_output(["cl"] + args + [filename], stderr=subprocess.DEVNULL) \
        .replace(b"\x0c", b"") # Replace form-feed control character (\f, or \x0c) that might pop up in Windows' headers

    with open(filename_postprocess, 'wb') as f:
        f.truncate(0)
        f.write(text)

    try:
        ast = parse_file(filename_postprocess, use_cpp=True,
                    cpp_path='cl',
                    cpp_args=args)

        visitor = DefNamesVisitor()
        visitor.visit(ast)

        lines = process(visitor.decls)

        with open('win32.txt', 'w') as f:
            f.truncate(0)
            for line in lines:
                f.write(f"{line}\n")
    except:
        print(traceback.format_exc())
