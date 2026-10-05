# 0001. How the name and the sources are given on the command line

Status: Accepted

## Why

**Goal:** easy to create. A contributor gives every source of the dictionary when creating it, in one command or in the
prompts.

**Problem:** Most dictionaries are compiled from several source files, but the generator took only one, so the rest were
added by hand afterwards.

## Decision

- The name is given positionally or as `--name`. Both, with different values, is an error.
- Sources are given positionally, as repeated `--source`, or both, and are combined:
  `pnpm create-dictionary ruby ruby.txt gems.txt`.
- Word lists and Hunspell files can be mixed. A `.dic` and `.aff` with the same base name are one source, whichever is
  given. A word list is a source with no name, copied into `src/`. A Hunspell file is the source `hunspell`
  ([0002](./0002-third-party-sources.md)).
- A missing source is an error. `--placeholder-word-lists` starts empty word lists instead, as placeholders: an empty
  `src/<name>.txt` when no source is given, or an empty file under the given name when a word list doesn't exist. When
  prompting, a missing word list asks whether to create a placeholder. It covers only word lists given on their own: a
  missing Hunspell or third-party file is always an error, since someone else made it.

## Consequences

- Every source can be given at creation, and commands stay short for people.
- Defaults depend on the whole set of sources ([0006](./0006-how-a-new-dictionary-is-built.md)).
- A forgotten or mistyped source fails loudly, unless starting empty was asked for.

## Context

`create-dictionary` took the directory name and one source file, each either positionally
(`pnpm create-dictionary ruby words.txt`) or as an option (`--name ruby --source words.txt`), and giving both forms with
different values was an error. Most dictionaries are compiled from several source files, so the rest were added by hand
afterwards. Many mix word lists and Hunspell files: `en_AU` is compiled from a Hunspell `.dic`, its
`src/additional_words.txt`, and shared word lists. A Hunspell source is a pair of files, `.dic` and `.aff`, and people
often list both even though either one finds the pair.

A dictionary's own word list is written by hand, so a new dictionary may not have one yet. Since #5841,
`--allow-missing-source`, now `--placeholder-word-lists`, lets it start empty, both when no source is given and when a named source doesn't exist.

## Rejected approaches

- One form only for the name and sources: the positional form is what people and the docs use, and the option form
  reads more clearly in scripts. Dropping either breaks one of those habits.
- A comma-separated list of sources (`--source a.txt,b.txt`): breaks on file names with commas, and no other option
  works that way.
- Word lists or one Hunspell pair, not both: simpler to explain, but rules out dictionaries like `en_AU`.
- Creating an empty `src/<name>.txt` unasked: one less option, but an agent that forgets its source gets an empty
  dictionary and a successful exit. A reviewer flagged that trap in #5841.
