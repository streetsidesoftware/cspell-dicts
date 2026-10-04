# 0005. How a new dictionary is built: trie, build at creation, and Hunspell depth

Status: Accepted

## Context

A dictionary is built either as plain text or as a trie, which is much smaller for large word lists. The new-dictionary
guide says to use a trie for Hunspell sources and for large source files (over about 1 MB), but the generator applied
only the first, so a contributor had to know to pass `--trie`.

The built files in `dict/` are committed with `src/`, and the sample test ([0006](./0006-a-static-sample.md)) needs
them. A plain-text dictionary's `prepare:dictionary` script runs the build, so CI builds it anyway; a Hunspell
dictionary's is `echo OK`, so its `dict/` has to be committed already built. Until a build runs, `dict/` holds a
placeholder, which for a trie isn't a valid dictionary.

`maxDepth` limits how many Hunspell affix rules are chained onto a stem when the build reads a `.dic` and `.aff`.
Unset, `hunspell-reader` uses 5; 0 means stems only. The template set `maxDepth: 1` on every source, "to prevent initial
builds from taking too long", including word lists, where it means nothing. Its effect depends on the language and
can't be predicted: for some dictionaries depths above 1 add no words, for some 1 and 5 build in about the same time,
for some a depth above 1 makes the build take hours or run out of memory, and for Hebrew even 1 is too much (`he` uses
0).

Hunspell's own manual says it strips at most two suffixes and one prefix (or two prefixes and one suffix with
`COMPLEXPREFIXES`). In `hunspell-reader`, every affix costs one level, prefixes included, so depth 3 matches Hunspell's
limit. Measurements (word counts, build time, memory):

- `nl_NL`: 788 thousand words at depth 1, 804 thousand at depth 2, no change from depth 3, all in about 5 s.
- `eu`: 3.9 million words at depth 1, in 22 s and 1.7 GB. Depth 2 didn't finish in 15 minutes.
- `hu_HU`: depth 1 didn't finish in 15 minutes; its committed depth 1 trie holds 379 million words.

Word lists build in seconds.

Options weighed:

- Keep the trie as the contributor's call, or drop `--trie` and always decide by rule, which leaves no way out when the
  rule is wrong for a dictionary.
- Build every new dictionary, so creating a `hu_HU`-sized dictionary waits over 15 minutes or runs out of memory; or
  build with a time limit, which is guesswork across machines and needs its own option.
- Leave `maxDepth` unset, so 5 applies.

## Decision

We will:

- **Default to a trie** when any source is a Hunspell file, or when the word lists add up to more than about 1 MB.
  `--trie` and `--no-trie` override the default.
- **Build at creation when all sources are word lists.** When any source is a Hunspell file, the generator doesn't
  build, and says to run `pnpm run build` when ready, or to lower `--hunspell-depth` if the build is too slow. `--build`
  builds anyway, and `--no-build` skips building a word-list dictionary.
- **Set no `maxDepth` on word lists.**
- **Default Hunspell sources to `maxDepth: 1`,** with a comment that says what it means: higher depths can add word
  forms, but can make the build very slow or run out of memory, so raise it only after checking.
- **Add `--hunspell-depth <n>`** to set it at creation, for a language whose depth is already known, such as 0 for
  Hebrew.

## Consequences

- Large code dictionaries get a trie without anyone asking. The threshold is approximate; the guide and the generator
  should name the same number.
- Creating a dictionary never hangs on a large Hunspell build.
- A word-list dictionary arrives with `dict/` built and its sample test passing. A Hunspell dictionary's sample test
  fails until its first build, and the generator's message says so.
- A natural language dictionary may be missing forms that need two chained rules until a maintainer raises the depth.
  Finding the right depth is tuning, not creation; it's out of scope here, and could be a later tool that builds at
  increasing depths and compares word counts.

<!-- cspell:ignore COMPLEXPREFIXES -->
