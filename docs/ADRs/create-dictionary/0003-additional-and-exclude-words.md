# 0003. Every new dictionary gets `src/additional_words.txt` and `src/exclude_words.txt`

Status: Accepted

## Context

The build generates a dictionary's words from its sources: a Hunspell `.dic` is expanded with the prefixes and suffixes
in its `.aff`, and word lists can be split into parts. Two things come up in almost every dictionary built from more
than one source:

- **Adding a word the sources don't generate.** When a dictionary has several sources, a later visitor can't easily
  tell which one a missing word belongs in. 50 dictionaries have a catch-all `src/additional_words.txt`, 42 of them with
  an upstream source. Other names exist too: `additional-terms.txt` (4), `additional-words.txt` (2), and
  `additional_tokens.txt` (2). Today the file is added by hand when someone first needs it.
- **Removing a word the build generates.** `excludeWordsFrom`, a target option in `cspell-tools.config.yaml`, names
  files of words to leave out of the built dictionary. It's the only lasting way to remove a word that comes from an
  upstream source: deleting it from the synced files doesn't last, because the next sync brings it back. 10 dictionaries
  use it, with three names: `src/exclude-words.txt` (6), `src/exclude-terms.txt` (3), and `src/exclude_words.txt` (1).
  So the word-changes guide can't give one instruction for removing a word that comes from upstream.

Creating the files only for dictionaries with more than one source, or with a third-party source, was weighed. But a
dictionary that starts with one source tends to gain more, and the guide's instructions would then depend on the
dictionary.

## Decision

We will create both files in every new dictionary:

- **`src/additional_words.txt`,** with only a header line, listed as one of the dictionary's sources.
  `--no-additional-words` leaves it out.
- **`src/exclude_words.txt`,** with a header saying what belongs in it, listed under the target's `excludeWordsFrom`.
  `--no-exclude-words` leaves it out.

## Consequences

- There is always one known place to add a word by hand, and one to remove a word, with the names most existing
  dictionaries use. The word-changes guide can give one instruction for each.
- Every dictionary built from upstream sources mixes in a word list, even if the file stays empty.
- A dictionary that must hold only upstream words is created with `--no-additional-words`.
- Existing dictionaries move to these names over time; that's out of scope here.
