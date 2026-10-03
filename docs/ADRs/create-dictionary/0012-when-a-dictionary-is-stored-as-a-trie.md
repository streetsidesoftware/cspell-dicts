# 0012. When a dictionary is stored as a trie

Status: Accepted

## Context

A dictionary is built either as plain text or as a trie, which is much smaller for large word lists.
[0002](./0002-word-lists-and-hunspell-files-mix.md) defaults to a trie when any source is a Hunspell file. The
new-dictionary guide also says to use a trie for large source files (over about 1 MB), but the generator didn't apply
that, so a contributor had to know to pass `--trie`.

Options weighed: keep size as the contributor's call, or drop `--trie` and always decide by rule, which leaves no way
out when the rule is wrong for a dictionary.

## Decision

We will default to a trie when any source is a Hunspell file, or when the word lists add up to more than about 1 MB.
`--trie` and `--no-trie` override the default.

## Consequences

- The default follows the guide's own rule, so large code dictionaries get a trie without anyone asking.
- The threshold is approximate; the guide and the generator should name the same number.
