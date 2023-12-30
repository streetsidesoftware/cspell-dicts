# Allows inspection of #include trees in input.h.output file.
# Usage:
#
#     python inspect_output.py absolute <line-number>
# Or:
#     python inspect_output.py relative <included-header-file-name> <line-number-in-included-header>
#
# All relevant #line directives preceding the given line which number will be printed.
#
# If line is relative to an included file, the line number from #line directives will
# be respected when searching for the relative line number in the absolute file.
#
# Sample usage:
#
# > python inspect_output.py relative string.h 137
# input.h:35 (@ input.h.output:13219)
# Windows.h:171 (@ input.h.output:14160)
# windef.h:24 (@ input.h.output:14184)
# minwindef.h:182 (@ input.h.output:17650)
# winnt.h:1186 (@ input.h.output:20118)
# guiddef.h:146 (@ input.h.output:20264)
# string.h:137 (@ input.h.output:21410)
#

import argparse
import re
from pathlib import Path
from typing import Callable, List, Optional, TypeVar

T = TypeVar('T')

def find(predicate: Callable[[T], bool], list: List[T]) -> Optional[int]:
    for (i, item) in enumerate(list):
        if predicate(item):
            return i

    return None

class FileVisit(object):
    def __init__(self, file_path: Path, line: int, absolute_line: int):
        self.file_path = file_path
        self.line = line
        self.absolute_line = absolute_line

    def __str__(self) -> str:
        return f"{self.file_path.name}:{self.line} (@ {self.absolute_line})"

class FileWalker(object):
    def __init__(self, file_name: Path):
        self.visits: List[FileVisit] = []
        self.file_name = file_name
        self.pattern = re.compile(r'#line\s+(\d+)\s+\"(.+)\"')

    def process_line(self, line_contents, absolute_line) -> Optional[FileVisit]:
        match = self.pattern.match(line_contents)
        if match == None: return None

        line = int(match.group(1))
        file = Path(match.group(2))
        if not file.is_absolute():
            file = Path.cwd().joinpath(file)

        visit = FileVisit(file, line, absolute_line)

        self.visits.append(visit)

        return visit

    def walk_to_relative(self, target_file_name: str, target_line_number: int) -> bool:
        self.visits = []

        current_visit = FileVisit(self.file_name, 1, 1)

        with open(self.file_name, 'r') as file:
            for (line, line_contents) in enumerate(file):
                visit = self.process_line(line_contents, line + 1)
                if visit != None:
                    current_visit = visit
                else:
                    current_visit.line += 1
                    current_visit.absolute_line += 1

                if current_visit.file_path.name == target_file_name and current_visit.line == target_line_number:
                    return True

        return False

    def walk_to_absolute(self, target_line_number):
        self.visits = []

        with open(self.file_name, 'r') as file:
            for (line, line_contents) in enumerate(file):
                if line >= target_line_number:
                    return

                visit = self.process_line(line_contents, line + 1)
                if visit != None:
                    current_visit = visit
                else:
                    current_visit.line += 1
                    current_visit.absolute_line += 1

    # Returns a reduced visit list where each element is the latest occurrence of a file name
    # on the input file.
    # The list is the minimal #line information needed to reconstruct the path of #include files
    # on a preprocessed header file.
    def min_visits(self) -> List[FileVisit]:
        result = []

        if len(self.visits) == 0:
            return result

        visit_stack: List[FileVisit] = []

        for visit in self.visits:
            index = find(lambda x: x.file_path == visit.file_path, visit_stack)

            if index != None:
                visit_stack = visit_stack[0:index]

            visit_stack.append(visit)

        return visit_stack

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Allows inspection of #include trees in a pre-processed C header file.')

    parser.add_argument('--file', dest='file_name', type=str,
                        default="input.h.output", help="File to inspect. Defaults to 'input.h.output' if not provided.")

    subparsers = parser.add_subparsers(dest='command')

    # absolute line
    absolute_parser = subparsers.add_parser('absolute', help='Inspects the input file by line number directly.')
    absolute_parser.add_argument('line_number', type=int,
                                 help='Inspects up to a given line number then stops.')

    # relative line
    relative_parser = subparsers.add_parser('relative', help='Inspects the input file by a relative .h file and line number, as dictated by #line directives.')
    relative_parser.add_argument('relative_file_name', type=str,
                                 help='File name and extension of file to search for in #line directives.')
    relative_parser.add_argument('line_number', type=int,
                                 help='A line number of the file to search for. The line number starts counting by the line number in the #line directive of the respective filename.')

    args = parser.parse_args()

    walker = FileWalker(Path.cwd().joinpath(Path(args.file_name)))

    if args.command == 'absolute':
        walker.walk_to_absolute(args.line_number)

        for visit in walker.min_visits():
            print(f"{visit.file_path.name}:{visit.line} (@ {args.file_name}:{visit.absolute_line})")

    if args.command == 'relative':
        if not walker.walk_to_relative(args.relative_file_name, args.line_number):
            print(f'Did not find file "{args.relative_file_name}" line {args.line_number}')
            exit(0)

        for visit in walker.min_visits():
            print(f"{visit.file_path.name}:{visit.line} (@ {args.file_name}:{visit.absolute_line})")
