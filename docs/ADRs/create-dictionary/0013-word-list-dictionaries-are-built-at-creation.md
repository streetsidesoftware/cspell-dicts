# 0013. Word-list dictionaries are built at creation; Hunspell ones aren't by default

Status: Accepted

## Context

The built files in `dict/` are committed with `src/`, and the sample test
([0009](./0009-a-static-sample-replaces-the-source-test.md)) needs them. A plain-text dictionary's `prepare:dictionary`
script runs the build, so CI builds it anyway; a Hunspell dictionary's is `echo OK`, so its `dict/` has to be committed
already built. Until a build runs, `dict/` holds a placeholder, which for a trie isn't a valid dictionary.

An earlier version of this decision built every new dictionary. Measurements then showed what that means for Hunspell
sources, even at depth 1 ([0015](./0015-hunspell-depth.md)): `eu` takes 22 s and 1.7 GB, and `hu_HU` doesn't finish
within 15 minutes. Word lists build in seconds.

Options weighed: build everything with a time limit, which is guesswork across machines and needs its own option; or
always build, so creating a `hu_HU`-sized dictionary waits over 15 minutes or runs out of memory.

## Decision

We will build a new dictionary at creation when all its sources are word lists. When any source is a Hunspell file, the
generator doesn't build it, and says to run `pnpm run build` when ready, or to lower `--hunspell-depth` if the build is
too slow. `--build` builds anyway, and `--no-build` skips building a word-list dictionary.

## Consequences

- Creating a dictionary never hangs on a large Hunspell build.
- A word-list dictionary arrives with `dict/` built and its sample test passing.
- A Hunspell dictionary's sample test fails until its first build, and the generator's message says so.
