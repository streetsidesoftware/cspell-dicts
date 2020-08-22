import json
import sys
from pathlib import Path

if sys.version_info[0] < 3:
    raise RuntimeError("Must be using Python 3")

IGNORE = ["cpp-dict", "php"]


# modified version from: https://stackoverflow.com/a/57814048/9737947
def remove_comments(file_path):
    contents = ""
    fh = open(file_path)

    for line in fh:
        cleaned_line = line.split("//", 1)[0]

        if len(cleaned_line) > 0 and line.endswith("\n") and "\n" not in cleaned_line:
            cleaned_line += "\n"

        contents += cleaned_line

    fh.close()
    return contents


if __name__ == "__main__":
    dicts = Path("packages")

    for path in dicts.iterdir():
        manifest = json.loads(remove_comments(path.joinpath("cspell-ext.json")))

        if manifest["id"] in IGNORE:
            continue

        files = [x["file"] for x in manifest["dictionaryDefinitions"]]

        for file in files:
            p = path.joinpath(file)
            p = path.joinpath(p.stem)

            if p.suffix == ".txt" and p.exists():
                print(f"sorting {str(p)} ...")

                content = p.read_text()
                content = content.split("\n")
                content = sorted(content, key=str.lower)

                if content[0] == "":
                    while content[0] == "":
                        del content[0]
                    content.append("")

                p.write_text("\n".join(content))
