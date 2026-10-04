# 0003. Every source is recorded in `sources.yaml`

Status: Accepted

## Context

Goal: traceable, and easy to maintain.

The generator, the sync ([0011](./0011-how-the-sync-handles-change.md)), and the READMEs
([0008](./0008-sources-are-explained-in-the-readmes.md)) all need to know each source: its kind, where it comes from,
its files, license, README, and URL. Today that knowledge is a set of scripts in the dictionary's `package.json`.
`th_th`, for example:

```json
"sync": "pnpm sync:syafiqhadzir && pnpm sync:LibreOffice",
"sync:LibreOffice": "sync-github-files LibreOffice/dictionaries --filter \"th_TH/th_TH.*\" … --tag=master -o src/LibreOffice",
"sync:syafiqhadzir": "sync-github-files syafiqhadzir/hunspell-th --filter \"th_TH.*\" … --tag=experimental -o src/syafiqhadzir",
```

A script per source is very hard to maintain, and a command line isn't a record anything else can read.

Rejected:

- Keeping the scripts.
- A structured field in `package.json`, such as `"cspell-dict": { "sources": … }`: always published with no new file,
  but npm doesn't know it, it can't hold comments, and a reader can't tell what it is.
- JSON: can't hold the comment that says what the file is. JSON5: `json5` drops comments when it writes a file back.
- Globs or folders in `files:`, as `th_th`'s `--filter "th_TH/th_TH.*"` and `de_DE`'s `dictionary-de/**` do today, so
  renamed and new upstream files arrive on their own. But the build names exact files, so a rename needs a person
  anyway, and a pattern can pull very large files, or files nobody reviewed, into the repo through a bot PR that's
  merged on trust.

## Decision

The generator writes `sources.yaml` at the dictionary's root, from the `--define-source*` and `--add-source-*` options,
and lists it in `files` so it's published:

```yaml
# The sources of this dictionary, read by `pnpm run sync`.
# Each source is copied into src/<name>/. See src/README.md.
sources:
  - name: aoo
    github: marcoagpinto/aoo-mozilla-en-dict
    files:
      - dicts/en_XX/en_XX.dic
      - dicts/en_XX/en_XX.aff
    license: LICENSE
    readme: README.md
    url: https://github.com/marcoagpinto/aoo-mozilla-en-dict
```

- A source has `github`, `npm`, or `path` for its kind and location, and optionally `ref`, `version`, and `max-size`
  ([0010](./0010-remote-sources.md), [0011](./0011-how-the-sync-handles-change.md)).
- `files:` lists exact paths, never globs or folders.
- There's no schema; tools report a clear error when something they need is missing.
- People edit it; no tool rewrites it.

## Consequences

- Adding or changing a source is an edit to one file, read by every tool.
- YAML adds no dependency: the generator writes it from a template, as it does `cspell-tools.config.yaml`, and
  `scripts/` already has `yaml`.
- A renamed upstream file needs a person to update `files:` and the build config together.

<!-- cspell:ignore syafiqhadzir marcoagpinto -->
