#!/usr/bin/env python3
from typing import Set, List

from os import listdir, getcwd
from os.path import join, exists, isfile

import git
from git import Repo

import xml.etree.ElementTree as xml

GODOT_REPO_URL = "https://github.com/godotengine/godot.git"
GODOT_REPO_DIR = join(getcwd(), "godot")

# <https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#keywords>
KEYWORDS: Set[str] = {
    "if",
    "elif",
    "else",
    "for",
    "while",
    "match",
    "when",
    "break",
    "continue",
    "pass",
    "return",
    "class",
    "class_name",
    "extends",
    "is",
    "in",
    "as",
    "self",
    "super",
    "signal",
    "func",
    "static",
    "const",
    "enum",
    "var",
    "breakpoint",
    "preload",
    "await",
    "yield",
    "assert",
    "void",
}

# <https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#built-in-types>
TYPES: Set[str] = {"null", "bool", "int", "float"}
METHODS: Set[str] = set()
FIELDS: Set[str] = set()
SIGNALS: Set[str] = set()
ANNOTATIONS: Set[str] = set()
CONSTANTS: Set[str] = set()


def clone_or_update_godot_repo() -> Repo | None:
    repo_dir = GODOT_REPO_DIR
    if exists(repo_dir):
        try:
            repo = Repo(repo_dir)
        except git.InvalidGitRepositoryError:
            print(f"[!] '{GODOT_REPO_DIR}' doesn't contain a valid repo")
            return None
        print(f"[-] Using existing repo in '{repo_dir}'")
        if repo.active_branch.name != "master":
            print("[-] Checking out the 'master' branch...")
            head = repo.heads.master.checkout()
            assert head.name == "master"
            print("[+] Branch checked out")

        print("[-] Updating repo...")
        repo.remotes.origin.pull("master", depth=1)
        print("[+] Repo updated")
    else:
        print(f"[-] Cloning repo into '{repo_dir}'...")
        repo = Repo.clone_from(
            GODOT_REPO_URL,
            repo_dir,
            depth=1,
            branch="master",
        )
        print("[+] Repo cloned")
    return repo


def parse_file(filepath: str) -> None:
    tree = xml.parse(filepath)
    root = tree.getroot()

    class_name = root.get("name")
    assert class_name is not None
    class_name = class_name.strip("@")
    TYPES.add(class_name)

    methods = root.find("methods")
    if methods is not None:
        for m in methods.iter("method"):
            name = m.get("name")
            assert name is not None
            METHODS.add(name.strip("_"))

    # Members can be either fields or classes.
    members = root.find("members")
    if members is not None:
        for m in members.iter("member"):
            name = m.get("name")
            type_name = m.get("type")
            assert name is not None
            assert type_name is not None
            if name == type_name:
                TYPES.add(type_name)
            else:
                FIELDS.update([w.strip("_") for w in name.split("/") if len(w) > 2])
            enum = m.get("enum")
            if enum is not None:
                TYPES.update(enum.split("."))

    signals = root.find("signals")
    if signals is not None:
        for s in signals.iter("signal"):
            name = s.get("name")
            assert name is not None
            SIGNALS.add(name)

    constants = root.find("constants")
    if constants is not None:
        for c in constants.iter("constant"):
            name = c.get("name")
            assert name is not None
            CONSTANTS.add(name)
            enum = c.get("enum")
            if enum is not None:
                TYPES.update(enum.split("."))

    annotations = root.find("annotations")
    if annotations is not None:
        for a in annotations.iter("annotation"):
            name = a.get("name")
            assert name is not None
            name = name.strip("@")
            ANNOTATIONS.add(name)


def main():
    repo = clone_or_update_godot_repo()
    if repo is None:
        return

    doc_dirs: List[str] = [
        join(repo.working_dir, "doc", "classes"),
        join(repo.working_dir, "modules", "gdscript", "doc_classes"),
    ]

    files: Set[str] = set()
    for dir in doc_dirs:
        if not exists(dir):
            print(f"[!] Directory '{dir}' doesn't exist")
            continue
        files.update(
            [
                join(dir, f)
                for f in listdir(dir)
                if f.endswith(".xml") and isfile(join(dir, f))
            ]
        )
    print(f"[-] Found {len(files)} files to parse")

    print("[-] Parsing files...")
    for file in files:
        parse_file(file)
    print("[+] Files parsed")

    print()
    print(f"[-] Found {len(KEYWORDS)} keywords")
    print(f"[-] Found {len(TYPES)} types")
    print(f"[-] Found {len(METHODS)} methods")
    print(f"[-] Found {len(FIELDS)} fields")
    print(f"[-] Found {len(SIGNALS)} signals")
    print(f"[-] Found {len(ANNOTATIONS)} annotations")
    print(f"[-] Found {len(CONSTANTS)} constants")

    words = set()
    words.update(
        KEYWORDS,
        TYPES,
        METHODS,
        FIELDS,
        SIGNALS,
        ANNOTATIONS,
        CONSTANTS,
    )

    with open("gdscript.txt", "w") as fd:
        fd.write("# Automatically generated word list. Do NOT modify manually.\n")
        fd.writelines([f"{word}\n" for word in sorted(words)])


if __name__ == "__main__":
    main()
