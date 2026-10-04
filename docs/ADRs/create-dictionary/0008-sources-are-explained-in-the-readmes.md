# 0008. Sources are explained in the dictionary's README and in `src/README.md`

Status: Accepted

## Context

A compiled dictionary is often a derivative work of its sources, so users need to see where its words came from and
under which licenses. A new dictionary's published `README.md` said only "MIT" and "Some packages may have other
licenses included", and `src/README.md` said only that source files belong in `src/`; it isn't published.

Each source is recorded in `sources.yaml` ([0007](./0007-remote-sources-and-sync.md)). The dictionary's README already
gets generated sections through `@@inject` markers, such as `<!--- @@inject: ./static/install.md --->`, filled in by
`pnpm run build:readme`, so they stay current.

Writing the list of sources into `src/README.md` once, and keeping it current by hand, was weighed; it drifts from the
record.

## Decision

We will explain the sources in two places, both from one generated list:

- **The dictionary's `README.md`** gets a "Sources" section through `<!--- @@inject: ./static/sources.md --->`. It lists
  each source from `sources.yaml`: where it came from, its license, and whether `pnpm run sync` keeps it up to date.
- **`src/README.md`** gets the same list, through `<!--- @@inject: ../static/sources.md --->`, followed by notes for
  maintainers: how `sync` works, and how to add a source.

## Consequences

- Users see each source and its license on npm.
- Both READMEs stay current from one record, and nobody edits the list of sources by hand.
- `static/sources.md` is generated from `sources.yaml`, like the other static files.
- `readme:inject` in the root `package.json` covers only `dictionaries/*/README.md`, so it needs
  `dictionaries/*/src/README.md` too.
