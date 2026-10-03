# 0008. A missing source is an error unless `--allow-missing-source` is given

Status: Accepted

## Context

A dictionary's own word list, `src/<name>.txt`, is written by hand, and a new dictionary may not have one yet. Since
#5841, `--allow-missing-source` covers two cases:

1. **No source given:** `pnpm create-dictionary ruby --yes --allow-missing-source` creates an empty `src/ruby.txt`.
2. **A named source that doesn't exist:** `pnpm create-dictionary ruby words.txt --yes --allow-missing-source` creates an
   empty `src/words.txt`.

Without the option, both are errors. The alternatives weighed:

- Create the empty `src/<name>.txt` without being asked. One less option, but an agent that forgets its source gets an
  empty dictionary and a successful exit. A reviewer flagged that trap in #5841.
- Make a named source that doesn't exist always an error, since it's most likely a typo.

`src/additional_words.txt` ([0003](./0003-additional-words-file.md)) doesn't change this: it holds words added on top
of an upstream source, not a dictionary's own word list.

## Decision

We will keep both rules. A missing source is an error, and `--allow-missing-source` means "start empty where a source
is missing": an empty `src/<name>.txt` when no source is given, and an empty file under the given name when a named
source doesn't exist. When prompting, a missing file asks whether to create it empty.

## Consequences

- A forgotten or mistyped source fails loudly, unless starting empty was asked for.
- This covers the contributor's own word lists. A missing file of a third-party source is always an error
  ([0006](./0006-third-party-sources-are-defined-by-name.md)).
