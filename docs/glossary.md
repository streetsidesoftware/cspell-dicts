# Glossary

Terms used across this repo's docs. Alphabetical.

## `allowedSplitWords`

A source option used with `split`. When every part of an entry is a word in these files, only the parts are added;
otherwise the whole entry is added. It keeps a misspelled part of a `camelCase` entry out of the dictionary. The files
can be in other packages, such as `../en_US/en_US.trie`.

## Bundled with cspell

A dictionary package that cspell includes by default, through `@cspell/cspell-bundled-dicts` in the
[cspell](https://github.com/streetsidesoftware/cspell) repo. That list is kept in cspell, not here. A package's
generated README says whether it is bundled.

## Conditional build

A build that skips a target when its `checksum.txt` shows that its sources haven't changed. `pnpm run build` at the root
and the Build Dictionaries workflow use it.

## Dictionary ID

The name a user writes in `dictionaries` in their cspell config or VS Code settings, such as `python` or
`python-common`. Defined in a package's `cspell-ext.json` under `dictionaryDefinitions`. One package can define several.

## Dictionary package

A package under `dictionaries/`, published to npm, usually as `@cspell/dict-<name>`. Its entry point is
`cspell-ext.json`.

## `excludeWordsFrom`

A target option naming files of words to leave out of the built dictionary. Used to remove words that come from an upstream
source, such as `en_US/src/exclude-words.txt`.

## Source

A file a target is built from: a word list in `src/`, a Hunspell `.dic` file, or another package's built file.

## `split`

A source option that splits each line into words, for lists of identifiers such as `camelCase` names. Used with
`allowedSplitWords`.

## Target

One output of a package build, defined under `targets` in `cspell-tools.config.yaml`: a name, its sources, and a
format.

## Trie

A compact dictionary format (`trie3`) for large word lists, used mainly for natural languages. Built as a `.trie` file.

## Upstream source

A word list maintained outside this repo, such as a Hunspell dictionary or a project's word list. A package's `sync`
script fetches it. See [Upstream updates](./guides/upstream-updates.md).
