# 0020. A dictionary's sources are recorded in a sources file

Status: Accepted

## Context

A dictionary with remote sources needs a record of each one: its kind, where it comes from, which files, its license,
and its URL. The sync uses it to fetch, the README's "Sources" section
([0021](./0021-sources-are-explained-in-the-readmes.md)) shows it, and later tools need to read it.

Today the record is a set of scripts in the dictionary's `package.json`, and `conditional-build` runs `sync` first.
`th_th`, for example:

```json
"sync": "pnpm sync:syafiqhadzir && pnpm sync:LibreOffice",
"sync:LibreOffice": "sync-github-files LibreOffice/dictionaries --filter \"th_TH/th_TH.*\" … --tag=master -o src/LibreOffice",
"sync:syafiqhadzir": "sync-github-files syafiqhadzir/hunspell-th --filter \"th_TH.*\" … --tag=experimental -o src/syafiqhadzir",
```

A script per source is very hard to maintain, and a command line isn't a record that anything else can read.

A structured field in `package.json`, such as `"cspell-dict": { "sources": { … } } }`, was weighed: always published,
with no new file. But npm doesn't know the field, it can't have comments, and a reader can't tell what it is.

An earlier version of this decision kept the scripts, after a misunderstanding of the question.

## Decision

We will record a dictionary's sources in a sources file, `sources.yaml`, read by one generic sync command. For example:

```yaml
sources:
  - name: aoo
    github: marcoagpinto/aoo-mozilla-en-dict
    files:
      - dicts/en_XX/en_XX.dic
      - dicts/en_XX/en_XX.aff
    license: LICENSE
    url: https://github.com/marcoagpinto/aoo-mozilla-en-dict
```

- The generator writes it from the `--define-source*` and `--add-source-*` options.
- `package.json` has one `sync` script that runs the sync command, and `conditional-build` runs `sync` first.
- The file is listed in `files`, so it's published with the dictionary, and it has a schema and comments so a reader can
  tell what it is.

## Consequences

- One record of every source, read by the generator, the sync, and the "Sources" section.
- Adding or changing a source is an edit to `sources.yaml`, not a new script.
- It needs a new sync command and file format. Existing dictionaries keep their `sync` scripts until they're moved,
  which is out of scope here.

<!-- cspell:ignore syafiqhadzir marcoagpinto -->
