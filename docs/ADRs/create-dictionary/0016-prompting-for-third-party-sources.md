# 0016. Prompting asks for third-party sources in a loop

Status: Accepted

## Context

Third-party sources are defined with `--define-source*` and `--add-source-*`
([0006](./0006-third-party-sources-are-defined-by-name.md)). Someone answering prompts instead of writing options needs
a way to do the same, or the hardest part of a new dictionary can only be set up by writing the command.

## Decision

After the dictionary's own sources, the generator asks "Add a third-party source?", and repeats until the answer is no.
For each source it asks, in order:

1. the name and where it is (a path, or later an npm package or GitHub repository)
2. its files, one at a time, until none is left to add
3. its license, README, and URL, each of which can be skipped, with a warning

The questions mirror the options one for one, so prompting and `--yes` with options produce the same dictionary.

## Consequences

- A contributor who runs `pnpm create-dictionary` with no options can set up a third-party source completely.
- The prompts grow with the options; adding an `--add-source-*` option means adding its question.
