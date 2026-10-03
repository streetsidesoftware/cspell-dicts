# 0003. Every new dictionary gets `src/additional_words.txt`

Status: Accepted

## Context

The build generates a dictionary's words from its sources: a Hunspell `.dic` is expanded with the prefixes and suffixes
in its `.aff`, and word lists can be split into parts. `src/additional_words.txt` adds words the sources don't
generate. It's a catch-all: when a dictionary is built from several sources, a later visitor can't easily tell which
source a missing word belongs in, so the catch-all gives them one obvious place.

50 dictionaries have one, 42 of them with an upstream source.
Other names exist too: `additional-terms.txt` (4), `additional-words.txt` (2), and `additional_tokens.txt` (2). Today
the file is added by hand when someone first needs it.

Creating it only for dictionaries with more than one source was weighed. But a dictionary that starts with one source
tends to gain more, and then the question of where a word goes comes back.

## Decision

We will create `src/additional_words.txt` in every new dictionary, with only a header line, and list it as one of its
sources. `--no-additional-words` leaves it out.

## Consequences

- There is always one known place to add a word by hand, with the same name as in most existing dictionaries.
- Every dictionary built from upstream sources mixes in a word list
  ([0002](./0002-word-lists-and-hunspell-files-mix.md)), even if the file stays empty.
- A dictionary that must hold only upstream words is created with `--no-additional-words`.
