# 0006. How a new dictionary is built: trie, build at creation, and Hunspell depth

Status: Accepted

## Context

Goal: easy to create, and easy to adopt.

- **Format.** A dictionary is built as plain text or as a trie, which is much smaller for large word lists. The
  new-dictionary guide says to use a trie for Hunspell sources and for sources over about 1 MB, but the generator
  applied only the first, so a contributor had to know to pass `--trie`.
- **Build.** The built files in `dict/` are committed with `src/`, and the tests need them. A plain-text dictionary's
  `prepare:dictionary` runs the build, so CI builds it anyway; a Hunspell dictionary's is `echo OK`, so its `dict/` must
  be committed built. Until a build runs, `dict/` holds a placeholder, which for a trie isn't a valid dictionary. Word
  lists build in seconds.
- **Depth.** `maxDepth` limits how many affix rules are chained onto a Hunspell stem. Unset, `hunspell-reader` uses 5;
  0 means stems only; every affix costs one level, prefixes included. The template set `maxDepth: 1` on every source,
  "to prevent initial builds from taking too long", including word lists, where it means nothing; it was a workaround
  for Yeoman's templates. Hunspell's own manual says it strips at most two suffixes and one prefix (or two prefixes and
  one suffix with `COMPLEXPREFIXES`), so depth 3 matches Hunspell's limit. The effect of depth can't be predicted:

  - `nl_NL`: 788 thousand words at depth 1, 804 thousand at depth 2, no change from depth 3, all in about 5 s.
  - `eu`: 3.9 million words at depth 1, in 22 s and 1.7 GB. Depth 2 didn't finish in 15 minutes.
  - `hu_HU`: depth 1 didn't finish in 15 minutes; its committed depth 1 trie holds 379 million words.
  - `he`: even depth 1 is too much; it uses 0.

Rejected: leaving the trie to the contributor, or always deciding by rule with no override; building every dictionary,
so a `hu_HU`-sized one waits over 15 minutes or runs out of memory; building with a time limit, which is guesswork across
machines; leaving `maxDepth` unset, so 5 applies. An early version built every new dictionary, before the measurements.

## Decision

- **Trie** when any source is a Hunspell file, or the word lists add up to more than about 1 MB. `--trie` and
  `--no-trie` override it.
- **Build at creation** when all sources are word lists. With a Hunspell source, the generator doesn't build, and says to
  run `pnpm run build`, or to lower `--hunspell-depth` if that's too slow. `--build` and `--no-build` override it.
- **Depth:** no `maxDepth` on word lists. Hunspell sources get `maxDepth: 1`, with a comment that higher depths can add
  word forms but can make the build very slow or run out of memory. `--hunspell-depth <n>` sets it, such as 0 for
  Hebrew.

## Consequences

- Creating a dictionary never hangs on a large Hunspell build.
- A word-list dictionary arrives built, with its tests passing. A Hunspell dictionary's tests fail until its first
  build, and the generator says so.
- The guide and the generator name the same trie threshold.
- A natural language dictionary may miss forms that need two chained rules until a maintainer raises the depth; that
  tuning is out of scope.

<!-- cspell:ignore COMPLEXPREFIXES -->
