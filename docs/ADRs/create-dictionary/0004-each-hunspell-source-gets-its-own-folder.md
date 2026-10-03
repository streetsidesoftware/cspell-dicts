# 0004. Each Hunspell source gets its own folder in `src/`

Status: Accepted

## Context

A compiled dictionary is often a derivative work of its sources, so each Hunspell source has to be traceable to where
it came from, with its license next to it. Existing dictionaries keep their Hunspell files in three ways:

- `src/hunspell/` (32 dictionaries), for example `de_DE`, which holds a copy of the npm package `dictionary-de`.
- Directly in `src/` (15).
- A folder named after the source (about 13), such as `hunspell-french-dictionaries-v7.0/`, `hunspell-en_AU-large/`,
  or `open-office-2008/`.

With several sources ([0001](./0001-name-and-sources-on-the-command-line.md)), a dictionary can have more than one
Hunspell source. `src/hunspell/` and `src/` itself each hold only one. `src/hunspell/<source-name>/` would work too, at
the cost of one more folder level.

## Decision

We will copy each Hunspell source into its own folder, `src/<source-name>/`, holding:

- the `.dic` and `.aff` files
- a `README.md` saying where they came from
- the source's license

For a local file, the folder is named after the `.dic`'s base name: `en_AU-large.dic` goes to `src/en_AU-large/`. A
source fetched from npm or a repository is named after the package or repository.

## Consequences

- Any number of Hunspell sources fit, each with its origin and license beside it.
- New dictionaries match the newer layout (`hunspell-en_AU-large/`) rather than `src/hunspell/`. Moving existing
  dictionaries is out of scope.
- Two sources whose `.dic` files have the same base name would get the same folder.
