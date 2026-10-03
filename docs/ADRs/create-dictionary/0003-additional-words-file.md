# 0003. Every new dictionary gets `src/additional_words.txt`

Status: Accepted

## Context

50 dictionaries have a `src/additional_words.txt`: a word list kept by hand, compiled along with their other sources.
Other names exist too: `additional-terms.txt` (4), `additional-words.txt` (2), and `additional_tokens.txt` (2). Today
the file is added by hand when someone first needs it.

## Decision

We will create `src/additional_words.txt` in every new dictionary, with only a header line, and list it as one of its
sources. `--no-additional-words` leaves it out.

## Consequences

- There is always one known place to add a word by hand, with the same name as in most existing dictionaries.
- Every dictionary built from upstream sources mixes in a word list
  ([0002](./0002-word-lists-and-hunspell-files-mix.md)), even if the file stays empty.
- A dictionary that must hold only upstream words is created with `--no-additional-words`.
