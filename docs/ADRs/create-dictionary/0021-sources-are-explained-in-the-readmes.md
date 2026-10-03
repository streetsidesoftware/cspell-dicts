# 0021. Sources are explained in the dictionary's README and in `src/README.md`

Status: Accepted

## Context

A compiled dictionary is often a derivative work of its sources, so users need to see where its words came from and
under which licenses. Today a new dictionary's published `README.md` says only "MIT" and "Some packages may have other
licenses included", and `src/README.md` says only that source files belong in `src/`; it isn't published.

Each source is recorded in the dictionary's sources file ([0020](./0020-sources-are-recorded-in-a-sources-file.md)).

The dictionary's README already gets generated sections through `@@inject` markers, such as
`<!--- @@inject: ./static/install.md --->`, filled in by `pnpm run build:readme`, so they stay current.

## Decision

We will explain the sources in two places:

- **The dictionary's `README.md`** gets a "Sources" section through `<!--- @@inject: ./static/sources.md --->`. It lists
  each source from the sources file: where it came from, its license, and whether `pnpm run sync` keeps it up to date. It's generated
  like the other static files, so it follows changes to the sources.
- **`src/README.md`** explains, for maintainers, how `sync` and the per-source scripts work, and how to add a source.

## Consequences

- Users see each source and its license on npm.
- `static/sources.md` is generated from the sources file.
