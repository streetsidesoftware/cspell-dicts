# 0004. Every new dictionary gets `src/additional_words.txt` and `src/exclude_words.txt`

Status: Accepted

## Why

**Goal:** easy to maintain. Every new dictionary has one known place to add a word and one to remove it.

**Problem:** Adding a word no source generates, or removing one the build generates, comes up in almost every
dictionary, but each dictionary has its own files for it, or none.

## Decision

Every new dictionary gets:

- `src/additional_words.txt`, with only a header line, listed as a source. `--no-additional-words` leaves it out.
- `src/exclude_words.txt`, with a header saying what belongs in it, listed under the target's `excludeWordsFrom`.
  `--no-exclude-words` leaves it out.

## Consequences

- There's one known place to add a word and one to remove it, and the word-changes guide can say so for every new
  dictionary.
- A dictionary that must hold only upstream words uses `--no-additional-words`.

## Context

The build generates words from the sources: Hunspell stems get the prefixes and suffixes in the `.aff`, and word lists
can be split into parts. Two fixes come up in almost every dictionary with more than one source:

- **Adding a word no source generates.** When a dictionary has several sources, a later visitor can't easily tell which
  one a missing word belongs in, so a catch-all gives them one obvious place. 50 dictionaries have
  `src/additional_words.txt`, 42 of them with an upstream source. Other names exist too: `additional-terms.txt` (4),
  `additional-words.txt` (2), and `additional_tokens.txt` (2). The file is added by hand when someone first needs it.
- **Removing a word the build generates.** `excludeWordsFrom`, a target option in `cspell-tools.config.yaml`, names
  files of words to leave out of the built dictionary. It's the only lasting way to remove an upstream word: deleting it
  from the synced copy is undone by the next sync. 10 dictionaries use it, under three names: `src/exclude-words.txt`
  (6), `src/exclude-terms.txt` (3), and `src/exclude_words.txt` (1). So the word-changes guide can't give one
  instruction for removing an upstream word.

## Rejected approaches

- Creating the files only for dictionaries with several sources, or with a third-party source. A dictionary that
  starts with one source tends to gain more, and the guide's instruction would then depend on the dictionary.
