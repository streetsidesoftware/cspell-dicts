# 0005. A word-list file goes into `src/`; a folder is copied as a folder

Status: Accepted

## Context

Programming language dictionaries are mostly sets of word lists, kept directly in `src/`. Nested folders hold `legacy`
lists, third-party sources, and anything that needs its own `README.md` or license. A third-party word list usually
comes with those files.

The generator has to tell a list the contributor wrote apart from a third-party one. The options weighed were:

- Always copy word lists directly into `src/`, and add a third-party list's `README.md` and license by hand afterwards.
  That's the cleanup this feature is meant to remove.
- An option per source, such as `--third-party <file>`, that makes a folder and a `README.md` to fill in. It's one more
  option, and it doesn't bring the license along.

## Decision

We will copy a source by what it is:

- **A file** goes directly into `src/`: `ruby.txt` becomes `src/ruby.txt`.
- **A folder** is copied as a folder, with everything in it: `vendor/rails-words/` becomes `src/rails-words/`, with its
  word lists, `README.md`, and license.

Word lists fetched from npm or a repository get their own folder, as Hunspell sources do
([0004](./0004-each-hunspell-source-gets-its-own-folder.md)).

## Consequences

- A third-party list keeps its `README.md` and license when it's given as a folder, with no extra option.
- A third-party list given as a single file loses its context; the contributor has to give the folder instead.
- What the folder's word lists contribute to the dictionary still has to be decided: every `.txt` in it, or only some.
