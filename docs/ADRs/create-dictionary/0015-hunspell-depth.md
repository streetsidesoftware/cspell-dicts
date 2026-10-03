# 0015. Hunspell sources default to a depth of 1

Status: Accepted

## Context

`maxDepth` limits how many Hunspell affix rules are chained onto a stem when the build reads a `.dic` and `.aff`.
Unset, `hunspell-reader` uses 5; 0 means stems only. The template set `maxDepth: 1` on every source, "to prevent
initial builds from taking too long", including word lists, where it means nothing; that was a workaround for Yeoman's
templates.

Its effect depends on the language, and can't be predicted:

- For some dictionaries, depths above 1 add no words.
- For some, 1 and 5 build in about the same time.
- For some, a depth above 1 makes the build take hours or run out of memory.
- For Hebrew, even 1 is too much; `he` uses 0.

Hunspell's own manual says it strips at most two suffixes and one prefix (or two prefixes and one suffix with
`COMPLEXPREFIXES`), so depths beyond that only follow continuation classes further than Hunspell itself would.

Measurements on three dictionaries (word counts, build time, memory):

- `nl_NL`: 788 thousand words at depth 1, 804 thousand at depth 2, no change from depth 3, all in about 5 s.
- `eu`: 3.9 million words at depth 1, in 22 s and 1.7 GB. Depth 2 didn't finish in 15 minutes.
- `hu_HU`: depth 1 didn't finish in 15 minutes; its committed depth 1 trie holds 379 million words.

In `hunspell-reader`, every affix costs one level, prefixes included, so depth 3 matches Hunspell's limit; `nl_NL` and
`eu` stop growing there. So the default has to be safe rather than complete. Leaving it unset, so 5 applies, was
weighed and rejected; but even depth 1 is too much for some large affix sets, which is why Hunspell dictionaries aren't
built at creation by default ([0013](./0013-word-list-dictionaries-are-built-at-creation.md)).

## Decision

We will:

- **Set no `maxDepth` on word lists.**
- **Default Hunspell sources to `maxDepth: 1`,** with a comment that says what it means: higher depths can add word
  forms, but can make the build very slow or run out of memory, so raise it only after checking.
- **Add `--hunspell-depth <n>`** to set it when the dictionary is created, for a language whose depth is already known,
  such as 0 for Hebrew.

## Consequences

- A natural language dictionary may be missing forms that need two chained rules until a maintainer raises the depth.
  Finding the right depth is tuning, not creation; it's out of scope here, and could be a later tool that builds at
  increasing depths and compares word counts.

<!-- cspell:ignore COMPLEXPREFIXES -->
