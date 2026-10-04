# 0009. Options for tests are hidden from `--help`

Status: Accepted

## Context

Goal: easy to create.

`--root <dir>` (the repo to create the dictionary in) and `--skip-install` (don't run `pnpm install`) let the tests
create dictionaries in a temporary folder without changing `pnpm-lock.yaml`. Outside the tests they're rarely useful.

Rejected: listing them with the options every contributor needs; replacing them with environment variables, which hides
behavior where it's hard to find.

## Decision

`--root` and `--skip-install` stay, hidden from `--help`. The package's README lists them under a note for tests.

## Consequences

- `--help` lists only what someone creating a dictionary needs, and the tests call the command the way a user does.
