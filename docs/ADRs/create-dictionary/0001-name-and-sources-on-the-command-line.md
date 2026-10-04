# 0001. How the name and the sources are given on the command line

Status: Accepted

## Context

`create-dictionary` used to take the directory name and one source file, each either positionally
(`pnpm create-dictionary ruby words.txt`) or as an option (`--name ruby --source words.txt`). Giving both forms with
different values is an error.

Most dictionaries are compiled from several source files, so the rest were added by hand afterwards. Many mix word lists
and Hunspell files: `en_AU` is compiled from a Hunspell `.dic`, its `src/additional_words.txt`, and shared word lists. A
Hunspell source is a pair of files, `.dic` and `.aff`, and people often list both even though either one finds the pair.

A dictionary's own word list is written by hand, and a new dictionary may not have one yet. Since #5841,
`--allow-missing-source` lets it start empty, both when no source is given and when a named source doesn't exist.

Options weighed:

- Keep only one form for the name and the sources. The positional form is what people and the docs use; the option
  form reads more clearly in scripts. Dropping either breaks one of those habits.
- Several sources as a comma-separated list (`--source a.txt,b.txt`). It breaks on file names with commas, and no other
  option works that way.
- Allow either word lists or one Hunspell pair, not both. Simpler to explain, but it rules out dictionaries like `en_AU`.
- Create an empty `src/<name>.txt` without being asked. One less option, but an agent that forgets its source gets an
  empty dictionary and a successful exit. A reviewer flagged that trap in #5841.

## Decision

We will keep both forms for the name and for the sources.

- The name takes one value. Giving it both ways with different values is an error.
- Sources take several values: `pnpm create-dictionary ruby ruby.txt gems.txt`, or `--source` repeated. Sources given
  both ways are combined.
- Word lists and Hunspell files can be mixed, and all go into the one dictionary. A Hunspell `.dic` and `.aff` with the
  same name count as one source, whichever of the two is given, or both. A Hunspell file is a third-party source
  ([0002](./0002-third-party-sources.md)); a word list is the contributor's own, copied directly into `src/`.
- A missing source is an error. `--allow-missing-source` means "start empty where a source is missing": an empty
  `src/<name>.txt` when no source is given, and an empty file under the given name when a named source doesn't exist.
  When prompting, a missing file asks whether to create it empty. This covers only the contributor's own word lists.

## Consequences

- Every source of a dictionary can be given when it's created, so none is added by hand afterwards.
- Commands stay short for people (`pnpm create-dictionary ruby words.txt`), and agents can name every value.
- The defaults depend on the whole set of sources, not on the first one
  ([0005](./0005-how-a-new-dictionary-is-built.md)).
- A forgotten or mistyped source fails loudly, unless starting empty was asked for.
