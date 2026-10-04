# 0002. Third-party sources are defined by name, each in its own folder

Status: Accepted

## Context

Goal: traceable, and easy to adopt.

A third-party source is one someone else maintains: an OpenOffice or other Hunspell dictionary, a word list in a
repository, a download. A compiled dictionary is often a derivative work of its sources, so each must be traceable to
where it came from, with its license beside its copy. To keep such a copy we need its name, its files, and, where it has
them, its license, README, and URL.

Existing dictionaries keep their Hunspell files in three ways: `src/hunspell/` (32), for example `de_DE`, which holds a
copy of the npm package `dictionary-de`; directly in `src/` (15); or a folder named after the source (about 13), such as
`hunspell-french-dictionaries-v7.0/`, `hunspell-en_AU-large/`, or `open-office-2008/`. Only the last fits several
sources. Upstream sources often have same-named files in different folders, such as `dicts/en_AU (Kevin Atkinson)/`.

Rejected:

- Working out a source's files by walking its folder and asking about each file: asks which file is which rather than
  what the source needs, and records nothing about where it came from. An early version did this.
- Options that take several values: such an option keeps reading words until the next option, so it swallows the
  positional sources that follow. Two values with a required name would work, but the name should be optional.
- A generated `README.md` in each source's folder: collides with the source's own README, repeats the sources file, and
  can drift from it.

## Decision

Each third-party source is defined with options that take one value each. Where a value needs a source name, the name
comes first, followed by `=`:

| Option                                       | What it does                                                 |
| -------------------------------------------- | ------------------------------------------------------------ |
| `--define-source [<name>=]<path>`            | a local source; the name defaults to the path's last segment |
| `--define-source-npm [<name>=]<package>`     | a source from npm ([0010](./0010-remote-sources.md))         |
| `--define-source-github [<name>=]<org/repo>` | a source from GitHub ([0010](./0010-remote-sources.md))      |
| `--add-source-file <name>=<path>`            | a word list or Hunspell file of the source, repeatable       |
| `--add-source-license <name>=<path>`         | the source's license                                         |
| `--add-source-readme <name>=<path>`          | the source's README                                          |
| `--add-source-url <name>=<url>`              | where the source can be found                                |

```sh
pnpm create-dictionary en_XX \
  --define-source aoo=./vendor/aoo-mozilla-en-dict \
  --add-source-file "aoo=dicts/en_XX/en_XX.dic" \
  --add-source-license aoo=LICENSE \
  --add-source-url aoo=https://github.com/marcoagpinto/aoo-mozilla-en-dict
```

- **Folder:** each source is copied into `src/<name>/`, with only the files named for it, at their paths relative to
  the source: `aoo=dicts/en_XX/en_XX.dic` becomes `src/aoo/dicts/en_XX/en_XX.dic`. A Hunspell file brings its pair.
  Where the source came from is recorded in the sources file ([0003](./0003-sources-file.md)), not in the folder.
- **Shortcut:** a positional Hunspell file defines a source: `pnpm create-dictionary en_XX vendor/en_XX.dic` defines a
  source named `en_XX`, from `vendor/`.
- **Names:** letters, digits, `_`, and `-`, as for a dictionary. Two sources with the same name are an error before
  anything is written, saying to name one with `--define-source <name>=<path>`.
- **Checks at creation:** a source needs at least one file, and every named file must exist; there's no
  `--allow-missing-source` exception. A missing license, README, or URL is a warning.
- **Prompting:** after the dictionary's own sources, the generator asks "Add a third-party source?" until the answer is
  no. For each, it asks the name and location, its files one at a time, then its license, README, and URL, each of
  which can be skipped with a warning. Prompting and `--yes` with options produce the same dictionary.

## Consequences

- Any number of sources fit, each with its license beside it and its origin in the sources file.
- Two Hunspell files with the same base name, such as two `en_US.dic`, need a name for one of them.
- Commands for natural language dictionaries get long; agents write them, and people can use the prompts.
- Each new `--add-source-*` option needs a matching prompt.

<!-- cspell:ignore marcoagpinto -->
