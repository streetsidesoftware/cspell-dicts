# 0020. Sync steps live in the dictionary's `package.json`

Status: Accepted

## Context

Today a dictionary with remote sources has `sync` scripts in its `package.json`, and its `conditional-build` script
runs `sync` first. `th_th`, for example, has one script per source and a `sync` that runs both. The Build Dictionaries
workflow, the upstream-updates guide, and the `upstream-update` skill all rely on this.

A sources file (such as `sources.yaml`) read by one generic `sync` command was weighed: a single record that the
generator, the sync, and a later tool could all read. It needs a new command and file format, and existing dictionaries
would differ from new ones.

## Decision

We will write a `sync:<source-name>` script for each remote source, a `sync` script that runs them all, and run `sync`
from `conditional-build`.

## Consequences

- New dictionaries fit the workflows, the guide, and the skill without changes to any of them.
- The sync steps are published with `package.json`, so how each source is fetched travels with the dictionary.
- To someone reading `package.json`, it isn't clear what a `sync` script is for, or which source each `sync:<name>`
  fetches. Where each source came from is recorded in its `src/<name>/README.md`
  ([0006](./0006-third-party-sources-are-defined-by-name.md)).
