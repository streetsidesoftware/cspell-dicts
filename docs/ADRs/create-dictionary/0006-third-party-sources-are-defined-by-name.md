# 0006. Third-party sources are defined by name, with their files, license, README, and URL

Status: Accepted

## Context

A third-party source is where a dictionary's words come from when someone else maintains them: an OpenOffice or other
Hunspell dictionary, a word list in a repository, a download. To keep a local copy that can be traced, we need to know:

- **a name**, which is also its folder in `src/` (required)
- **its source files**: the word lists and Hunspell files (required)
- **its license**, if it has one (encouraged)
- **its README**, if it has one (encouraged)
- **its URL** (encouraged)

[0005](./0005-a-folder-source-keeps-only-its-words-license-and-readme.md) tried to work these out from a folder, by
asking about each file. That asked the wrong question: which file is which, rather than what the source needs. It also
had no way to record where the source came from.

Options take one value each. An option that takes several keeps reading words until the next option, so it would swallow
the positional sources that follow it. Two values with a required name would work too, but the name should be optional.

## Decision

We will define each third-party source with named options. Each takes one value. Where a value needs a source name, the
name comes first, followed by `=`:

| Option                                       | What it does                                                   |
| -------------------------------------------- | -------------------------------------------------------------- |
| `--define-source [<name>=]<path>`            | a local source; the name defaults to the path's last segment   |
| `--define-source-npm [<name>=]<package>`     | a source from npm; the name defaults to the package name       |
| `--define-source-github [<name>=]<org/repo>` | a source from GitHub; the name defaults to the repository name |
| `--add-source-file <name>=<path>`            | a word list or Hunspell file of the source, repeatable         |
| `--add-source-license <name>=<path>`         | the source's license                                           |
| `--add-source-readme <name>=<path>`          | the source's README                                            |
| `--add-source-url <name>=<url>`              | where the source can be found                                  |

Paths in the `--add-source-*` options are relative to the source. For example:

```sh
pnpm create-dictionary en_XX \
  --define-source aoo=./vendor/aoo-mozilla-en-dict \
  --add-source-file "aoo=dicts/en_XX/en_XX.dic" \
  --add-source-license aoo=LICENSE \
  --add-source-url aoo=https://github.com/marcoagpinto/aoo-mozilla-en-dict
```

- Each source is copied into `src/<name>/`, with only the files named for it. They keep their paths relative to the
  source: `aoo=dicts/en_AU (Kevin Atkinson)/en_AU.dic` becomes `src/aoo/dicts/en_AU (Kevin Atkinson)/en_AU.dic`. Upstream
  sources often have same-named files in different folders, and the sync stage can copy the same paths again on each
  update. A Hunspell file brings its pair ([0001](./0001-name-and-sources-on-the-command-line.md)).
- A generated `README.md` in the folder records the source's name, URL or package, files, and license.
- A source needs at least one file. A missing license, README, or URL is a warning, not an error.
- A source name follows the same rules as a dictionary name: letters, digits, `_`, and `-`. Names can't contain `=`.
- Positional sources and `--source` stay for the contributor's own word lists, copied directly into `src/`.
- `--define-source-npm` and `--define-source-github` belong to the sync stage, which decides how they're fetched and
  kept up to date.

## Consequences

- Everything needed to trace a source is given in one command, and nothing else from the upstream folder is copied.
- Commands for natural language dictionaries get long; agents write them, and people can use the prompts.
- The generator no longer walks a folder asking about each file.
