# 0008. Sources are explained in the dictionary's README and in `src/README.md`

Status: Accepted

## Why

**Goal:** traceable. Anyone looking at a dictionary, on npm or in the repo, can see where its words came from and under
which licenses.

**Problem:** A new dictionary's README said only "MIT" and "Some packages may have other licenses included".

## Decision

`static/sources.csv` is generated from `sources.yaml` ([0003](./0003-sources-file.md)) and the sync's state
([0011](./0011-how-the-sync-handles-change.md)) by `pnpm run build:readme`. It lists each source: where it came from,
its license, whether `pnpm run sync` keeps it current, and anything "no longer upstream since <date>". inject-markdown
shows it as a table, with the columns Source, From, License, and Updated:

| Source | From                                                                                                     | License                         | Updated                    |
| ------ | -------------------------------------------------------------------------------------------------------- | ------------------------------- | -------------------------- |
| de     | [wooorm/dictionaries, dictionaries/de](https://github.com/wooorm/dictionaries/tree/HEAD/dictionaries/de) | [license](https://github.com/…) | weekly, by `pnpm run sync` |

- The dictionary's `README.md` injects it as a "Sources" section: `<!--- @@inject: ./static/sources.csv#markdown --->`.
  The License section says the sources keep their own licenses, instead of "Some packages may have other licenses
  included".
- `src/README.md` injects it too, `<!--- @@inject: ../static/sources.csv#markdown --->`, followed by notes for
  maintainers: how `sync` works and how to add a source.

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
- Generating the table as Markdown, `static/sources.md`: the generator would escape and align the table itself. As data,
  inject-markdown makes the table, the same way as `samples/sample-sources.csv`, and `#html-table` can make room for
  longer notes.
- A list, one entry per source: harder to compare sources at a glance.

<!-- cspell:ignore wooorm -->
