# 0005. A folder source keeps only its word lists, license, and README

Status: Accepted

## Context

Programming language dictionaries are mostly sets of word lists, kept directly in `src/`. Nested folders hold `legacy`
lists, third-party sources, and anything that needs its own `README.md` or license.

Someone who gives a folder has a third-party source: a repository checkout, an unpacked OpenOffice extension, a
downloaded archive. They want three things from it: the word lists for their dictionary, the license that lets us use
them, and a record of where it came from. The rest of the folder (scripts, tests, other languages) isn't wanted.
`aoo-mozilla-en-dict`, for example, holds Hunspell files for six English variants, and `en_AU` uses one.

An earlier version of this decision copied the whole folder. That brought in files nobody wanted, which is the cleanup
this feature is meant to remove. Other options weighed:

- Copy third-party lists directly into `src/` and add their license by hand afterwards.
- An option per source, such as `--third-party <file>`, which doesn't bring the license along.
- Never prompt per file, and compile every `.txt` in the folder. A stray `.txt` that isn't a word list gets compiled.
- Make `--yes` without named files an error, so an agent must look inside the folder first.

## Decision

We will copy a source by what it is:

- **A file** goes directly into `src/`: `ruby.txt` becomes `src/ruby.txt`.
- **A folder** becomes `src/<folder-name>/`, holding only:
  - its word lists and Hunspell pairs
  - its license
  - its own `README`, if it has one
  - a new `README.md` recording where the source came from

Which files are which:

- **Files named inside the folder** on the command line are its word lists:
  `vendor/rails-words/ vendor/rails-words/words.txt`.
- **Otherwise the generator asks about each file:** word list, license, or skip. Each prompt's default follows a rule:
  `.txt` files and Hunspell pairs are word lists, `LICENSE*` and `COPYING*` are the license, and `README*` is the
  source's own README. Anything else is skipped.
- **With `--yes`,** every default is taken, so the result is what pressing Enter at every prompt would give.

Word lists fetched from npm or a repository get their own folder the same way, as Hunspell sources do
([0004](./0004-each-hunspell-source-gets-its-own-folder.md)).

## Consequences

- A third-party source arrives with its license and origin, and without the rest of its folder.
- A third-party list given as a single file loses its context; the contributor has to give the folder instead.
- With `--yes`, a stray `.txt` that isn't a word list is compiled unless the word lists are named.
