# 0008. Sources are explained in the dictionary's README and in `src/README.md`

Status: Accepted

## Why

**Goal:** traceable. Anyone looking at a dictionary, on npm or in the repo, can see where its words came from and under
which licenses.

**Problem:** A new dictionary's README said only "MIT" and "Some packages may have other licenses included".

## Decision

`static/sources.md` is generated from `sources.yaml` ([0003](./0003-sources-file.md)) and the sync's state
([0011](./0011-how-the-sync-handles-change.md)). It lists each source: where it came from, its license, whether
`pnpm run sync` keeps it current, and anything "no longer upstream since <date>".

- The dictionary's `README.md` injects it as a "Sources" section: `<!--- @@inject: ./static/sources.md --->`.
- `src/README.md` injects it too, `<!--- @@inject: ../static/sources.md --->`, followed by notes for maintainers: how
  `sync` works and how to add a source.

## Consequences

- Users see each source and its license on npm, and nobody maintains the list by hand.
- `readme:inject` in the root `package.json` covers only `dictionaries/*/README.md`, so it gains
  `dictionaries/*/src/README.md`.

## Context

Users need to see where a dictionary's words came from and under which licenses. A new dictionary's README says only
"MIT" and "Some packages may have other licenses included", and `src/README.md`, which isn't published, says only that
source files belong in `src/`. The README already gets generated sections through `@@inject` markers, filled in by
`pnpm run build:readme`.

## Rejected approaches

- Writing the list of sources into `src/README.md` once, by hand: it drifts.
