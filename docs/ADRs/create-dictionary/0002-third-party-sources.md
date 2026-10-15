# 0002. Third-party sources are defined by name, each in its own folder

## Why

**Goals:** traceable, and easy to adopt. Every third-party source can be traced to where it came from, with its license
beside its copy, without a maintainer setting that up by hand.

**Problem:** A compiled dictionary is often a derivative work of its sources, but the generator recorded nothing about
where a source came from, and existing dictionaries keep third-party files in three different ways.

## Decision

Each third-party source is defined with options that take one value each. Where a value needs a source name, the name
comes first, followed by `=`:

| Option                                                    | What it does                                                                                       |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `--define-source [<name>=]<path>`                         | a local source; the name defaults to the path's last segment                                       |
| `--define-source-npm [<name>=]<package>[/<path>]`         | a source from npm ([0010](./0010-remote-sources.md))                                               |
| `--define-source-github [<name>=]<owner>/<repo>[/<path>]` | a source from GitHub ([0010](./0010-remote-sources.md))                                            |
| `--add-source-file <name>[/<local-path>]=<path>`          | a word list or Hunspell file of the source, repeatable                                             |
| `--add-source-license <name>[/<local-path>]=<path>`       | the source's license                                                                               |
| `--add-source-readme <name>[/<local-path>]=<path>`        | the source's README                                                                                |
| `--add-source-url <name>=<url>`                           | where the source can be found                                                                      |
| `--add-source-ref <name>=<ref>`                           | another branch, a tag, or a commit for a GitHub source ([0010](./0010-remote-sources.md))          |
| `--add-source-version <name>=<version>`                   | a version or tag for an npm source ([0010](./0010-remote-sources.md))                              |
| `--add-source-max-size <name>=<size>`                     | raises a remote source's 30 MB cap, such as `40MB` ([0011](./0011-how-the-sync-handles-change.md)) |

```sh
pnpm create-dictionary en_XX \
  --define-source aoo=./vendor/aoo-mozilla-en-dict \
  --add-source-file "aoo=dicts/en_XX/en_XX.dic" \
  --add-source-license aoo=LICENSE \
  --add-source-url aoo=https://github.com/marcoagpinto/aoo-mozilla-en-dict
```

- **Folder:** each source is copied into `src/<name>/`, with only the files named for it. Where the source came from
  is recorded in the sources file ([0003](./0003-sources-file.md)), not in the folder.
- **Local paths:** a file keeps its path relative to the source, so `aoo=dicts/en_XX/en_XX.dic` becomes
  `src/aoo/dicts/en_XX/en_XX.dic`. An optional local path after the name puts it elsewhere in the folder: with
  `--define-source-github aoo=marcoagpinto/aoo-mozilla-en-dict/dicts/en_XX`, `--add-source-license
aoo/LICENSE=../../LICENSE` brings in the license kept at the repository's root as `src/aoo/LICENSE`. A local path must
  stay inside `src/<name>/`, and a path that leaves the source (`../`) needs one. A Hunspell file brings its pair, to
  the same local folder.
- **Published with the dictionary:** the generator adds each source's license and README to the dictionary's
  `files`, at their local paths, such as `src/aoo/LICENSE`. A published dictionary is often a derivative work of its
  sources, so it ships with their terms.
- **Shortcut:** a positional Hunspell file, with its pair, is a file of the source `hunspell`, copied into
  `src/hunspell/` as 32 dictionaries keep theirs: `pnpm create-dictionary en_XX vendor/index.dic`. Every positional
  Hunspell file joins that one source, as `grc_GR` keeps two. Hunspell files often have names like `index.dic` that make
  poor source names, and a nested folder keeps people from editing them by hand. Its paths are relative to where the
  command runs, and the `--add-source-*` options take `hunspell` like any other name.
- **Names:** letters, digits, `_`, and `-`, as for a dictionary. Two sources with the same name are an error before
  anything is written, saying to name one with `--define-source <name>=<path>`.
- **Checks at creation:** a source needs at least one file, and every named file must exist; there's no
  `--placeholder-word-lists` exception. A missing license, README, or URL is a warning.
- **Prompting:** after the dictionary's own sources, the generator asks "Add a third-party source?" until the answer is
  no. For each, it asks the name and location, its files one at a time with where to put each (defaulting to its path
  relative to the source), then its license, README, and URL, each of
  which can be skipped with a warning. Prompting and `--yes` with options produce the same dictionary.

## Consequences

- Any number of sources fit, each with its license beside it and its origin in the sources file.
- Two positional Hunspell files with the same file name, such as two `index.dic`, would both land in `src/hunspell/`.
  That's an error, and one of them needs `--define-source`.
- Commands for natural language dictionaries get long; agents write them, and people can use the prompts.
- Each new `--add-source-*` option needs a matching prompt.

## Context

A third-party source is a set of files someone else maintains, such as an OpenOffice or other Hunspell dictionary, or a
word list kept in another repository or offered on a website. A compiled dictionary is often a derivative work of its
sources, so each must be traceable to where it came from, with its license beside its copy. To keep such a copy we need
its name, its files, and, where it has them, its license, README, and URL.

37 dictionaries already publish a source's license or README from `src/`, such as `de_DE`'s `src/hunspell/license`,
`ar`'s `src/ayaspell/COPYING`, and the `en_*` dictionaries' `README_en_*.txt`, where those sources state their license.

Existing dictionaries keep their Hunspell files in three ways: `src/hunspell/` (32), for example `de_DE`, which holds a
copy of the npm package `dictionary-de`; directly in `src/` (15); or a folder named after the source (about 13), such as
`hunspell-french-dictionaries-v7.0/`, `hunspell-en_AU-large/`, or `open-office-2008/`. Only the last fits several
sources. Upstream sources often have same-named files in different folders, such as `dicts/en_AU (Kevin Atkinson)/`.

## Rejected approaches

- Working out a source's files by walking its folder and asking about each file: asks which file is which rather than
  what the source needs, and records nothing about where it came from. An early version did this.
- Options that take several values, such as a remote path and a local path: such an option keeps reading words until the
  next option, so it swallows the positional sources that follow. Two values with a required name would work, but the
  name should be optional.
- A generated `README.md` in each source's folder: collides with the source's own README, repeats the sources file, and
  can drift from it.

<!-- cspell:ignore marcoagpinto ayaspell -->
