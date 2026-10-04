# 0009. Options for tests are hidden from `--help`

Status: Accepted

## Context

`--root <dir>` (the repo to create the dictionary in) and `--skip-install` (don't run `pnpm install` in it) were added
so the tests can create dictionaries in a temporary folder without changing `pnpm-lock.yaml`. Outside the tests they're
rarely useful: creating a dictionary in another checkout, or working offline.

Options weighed: keep them visible next to the options every contributor needs, or replace them with environment
variables that only the tests set, which hides behavior where it's hard to discover.

## Decision

We will keep `--root` and `--skip-install`, but hide them from `--help`. They're still accepted, and the package's
README lists them under a short note for tests.

## Consequences

- `--help` lists only what someone creating a dictionary needs.
- The tests keep calling the command the way a user does.
