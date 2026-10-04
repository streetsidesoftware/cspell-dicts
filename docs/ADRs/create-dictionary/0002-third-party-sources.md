# 0002. Third-party sources are defined by name, each in its own folder

Status: Accepted

## Context

A third-party source is where a dictionary's words come from when someone else maintains them: an OpenOffice or other
Hunspell dictionary, a word list in a repository, a download. A compiled dictionary is often a derivative work of its
sources, so each one has to be traceable to where it came from, with its license next to it. To keep a local copy that
can be traced, we need to know:

- **a name**, which is also its folder in `src/` (required)
- **its source files**: the word lists and Hunspell files (required)
- **its license**, if it has one (encouraged)
- **its README**, if it has one (encouraged)
- **its URL** (encouraged)

Existing dictionaries keep their Hunspell files in `src/hunspell/` (32), directly in `src/` (15), or in a folder named
after the source (about 13), such as `hunspell-en_AU-large/`. With several sources, only the last holds more than one.

Options weighed:

- Work these out from a folder, asking about each file. That asks which file is which, rather than what the source
  needs, and has no way to record where the source came from.
- Options that take several values. Such an option keeps reading words until the next option, so it would swallow the
  positional sources that follow it.
- A generated `README.md` in each source's folder, saying where it came from. It would collide with the source's own
  README, repeat the sources file ([0007](./0007-remote-sources-and-sync.md)), and could drift from it.

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

- **Each source is copied into `src/<name>/`,** with only the files named for it: its word lists or Hunspell files, and
  its license and README if it has them. They keep their paths relative to the source:
  `aoo=dicts/en_AU (Kevin Atkinson)/en_AU.dic` becomes `src/aoo/dicts/en_AU (Kevin Atkinson)/en_AU.dic`. Upstream
  sources often have same-named files in different folders, and the sync can copy the same paths again on each update.
  A Hunspell file brings its pair.
- **Nothing is generated in the folder,** so the sync can replace it. Where the source came from is recorded in the
  sources file ([0007](./0007-remote-sources-and-sync.md)).
- **A positional Hunspell file is a shortcut** for `--define-source`: `pnpm create-dictionary en_XX vendor/en_XX.dic`
  defines a source named `en_XX`, from `vendor/`, with that file.
- **A source name** follows the same rules as a dictionary name: letters, digits, `_`, and `-`. Two sources with the
  same name are an error, before anything is written, with a message saying to name one of them with
  `--define-source <name>=<path>`.
- **A source needs at least one file.** A missing license, README, or URL is a warning, not an error. A named file must
  exist: a missing one is always an error, with no `--allow-missing-source` exception. A local source's files are
  checked when the dictionary is created; a remote source's when they're fetched.
- **When prompting,** after the dictionary's own sources, the generator asks "Add a third-party source?", and repeats
  until the answer is no. For each source it asks for the name and where it is, then its files one at a time, then its
  license, README, and URL, each of which can be skipped with a warning. The questions mirror the options one for one,
  so prompting and `--yes` with options produce the same dictionary.

## Consequences

- Everything needed to trace a source is given in one command, and nothing else from the upstream folder is copied.
- Any number of sources fit, each with its license beside it and its origin in the sources file.
- New dictionaries match the newer layout (`hunspell-en_AU-large/`) rather than `src/hunspell/`.
- Two Hunspell files with the same base name, such as two `en_US.dic` files, need a name for one of them.
- Commands for natural language dictionaries get long; agents write them, and people can use the prompts.
- The prompts grow with the options: adding an `--add-source-*` option means adding its question.
