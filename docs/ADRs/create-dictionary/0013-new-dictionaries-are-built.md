# 0013. A new dictionary is built when it's created

Status: Accepted

## Context

The built files in `dict/` are committed with `src/`, and the sample test
([0009](./0009-a-static-sample-replaces-the-source-test.md)) needs them. The generator used to build only when a source
was a Hunspell file. A plain-text dictionary's `prepare:dictionary` script runs the build, so CI builds it anyway; a
Hunspell dictionary's is `echo OK`, so its `dict/` has to be committed already built. Until a build runs, `dict/` holds
a placeholder, which for a trie isn't a valid dictionary.

Options weighed: keep building only for Hunspell sources, or never build by default and let each contributor remember.

## Decision

We will build every new dictionary when it's created. `--no-build` skips the build.

## Consequences

- A new dictionary arrives with `dict/` built and its sample test passing, ready to commit.
- Creating a dictionary from a large Hunspell source takes as long as its build; `--no-build` is there for that.
- With `--no-build`, `dict/` keeps its placeholder until the first build.
