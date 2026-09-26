# Build and packaging

How the dictionary packages in this repo are laid out, built, tested, and published, and which files are generated.

## Workspace

This is a pnpm workspace. pnpm is the only package manager allowed: the root `preinstall` script rejects npm and yarn.
`pnpm-workspace.yaml` lists the workspace packages:

- `dictionaries/*`: one package per dictionary, published as `@cspell/dict-<name>` (a few older packages have other
  names, such as `@cspell/aoo-mozilla-en-dict`). These are what users install.
- `dictionaries/*/scripts`: helper packages for dictionaries that need their own scripts to fetch or build sources.
- `packages/*`: internal packages, such as `@internal/en-freq`. Not published.
- `scripts`: repo-level tooling (`cspell-dicts-scripts`, private): README generation, sorting, syncing upstream files.
- `generator-cspell-dicts`: the generator behind `pnpm run create-dictionary`.
- `cspell-dict-file-checker`: a private tool that checks files against a snapshot.

## A dictionary package

A typical `dictionaries/<name>/` holds:

- `src/`: the source word lists. This is what contributors edit.
- `dict/`: the built dictionary files. Generated from `src/`, and committed.
- `cspell-tools.config.yaml`: the build configuration. Each target names its sources, its output format (`plaintext` or
  `trie3`), and options such as `split`, `allowedSplitWords`, and `excludeWordsFrom`.
- `cspell-ext.json`: the package's entry point (`exports` maps `.`, `./cspell`, and `./cspell-ext.json` to it). It
  defines the dictionary IDs (`dictionaryDefinitions`) and which file types or locales enable them
  (`languageSettings`).
- `cspell.json`: the config used to spell check the package itself.
- `samples/` or `tests/`: files the package's `test` script spell checks with the dictionary.
- `static/`: generated README snippets (see [Generated files](#generated-files)).
- `README.md`: rendered on GitHub and on npmjs.com.
- `checksum.txt`: present when `cspell-tools.config.yaml` sets `checksumFile: true`.

One package can define more than one dictionary ID. `@cspell/dict-python`, for example, defines `python` and
`python-common`.

Large natural language dictionaries are built as tries (`.trie`). Some are written to the package root rather than
`dict/`, as `en_US/en_US.trie` is. Compressed `.gz` files are built before publishing and are not committed.

## Sources from other packages

A dictionary can read another package's files:

- directly by relative path, such as `allowedSplitWords: ../en_US/en_US.trie`. 13 packages do this.
- through a workspace dependency, such as `node_modules/@cspell/dict-en-shared/dict/acronyms.txt`. Every English
  dictionary reads `en_shared`'s built files this way.

So a change in one package can change another package's build. Build the package you changed, then the packages
that read from it.

`@cspell/dict-cspell-bundle` (`dictionaries/cspell`) imports a set of dictionaries. Its build regenerates the
`import` list in its `cspell-ext.json` from its `dependencies`.

## Building and testing

From the repo root:

```sh
pnpm install
pnpm run prepare:dictionaries   # build what each package needs before it can be used or tested
pnpm test                       # every package's test script
```

One package:

```sh
pnpm --filter @cspell/dict-git run build
pnpm --filter @cspell/dict-git test
```

Or run `pnpm run build` and `pnpm test` inside `dictionaries/<name>/`.

- `pnpm run build` at the root runs `setup` (install and `prepare:dictionaries`) and then a conditional build of every
  package. A conditional build skips a target whose `checksum.txt` shows no change. For some packages it also runs
  `sync` first.
- `pnpm run build:all` rebuilds every package unconditionally. It is slow.
- `pnpm run sort` sorts the source word lists listed in `sort-source.config.json`.

## Generated files

Never edit these by hand. Change the source, then regenerate.

| Generated                                                                                                         | Regenerate with                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `dictionaries/*/dict/*`, and `.trie` files at a package root                                                      | `pnpm run build` in the package                                                       |
| `checksum.txt`                                                                                                    | The package build                                                                     |
| `dictionaries/cspell/cspell-ext.json` → `import`                                                                  | `pnpm run build` in `dictionaries/cspell`                                             |
| Upstream files fetched by a package's `sync` script, such as `src/hunspell/`, and their `.sync-github-files.json` | `pnpm run sync` in the package (see [Upstream updates](./guides/upstream-updates.md)) |
| `dictionaries/*/static/{install.md,example.cspell.json,example.cspell.config.yaml,vscode-settings.json}`          | `pnpm run build:readme`                                                               |
| `static/dictionary-packages.json` and `static/dictionary-packages.md`                                             | `pnpm run build:readme`                                                               |
| `static/contributors.json` and `static/contributors.md`                                                           | `update-contributors`, run by the Update Readme workflow                              |
| Anything between `@@inject` markers, in `README.md` and `dictionaries/*/README.md`                                | `pnpm run build:readme`                                                               |
| `CHANGELOG.md` files and `.release-please-manifest.json`                                                          | Release Please (see [Releasing](./releasing.md))                                      |
| `release-please-config.json`                                                                                      | `scripts/gen-release-please-config.sh`, from `scripts/gen-release-please-config*.jq`  |

`pnpm run check-dirty` fails if the working tree has changes. Run it after a regenerate command to check that nothing
was left out of date.

## What gets published

Each package's `files` field lists what npm publishes: usually `cspell-ext.json` and the built dictionary files. Word
lists in `src/` are not published, but upstream license and README files often are, such as `src/hunspell/license`.
Each package has its own `LICENSE`, since npm only includes a license file from inside the package.

A package's `README.md` is its npmjs.com page, so its links must be absolute `https://` URLs. See
[Style](./style.md#writing-for-users).

## CI

Workflows in `.github/workflows/`:

| Workflow                  | Runs on                                                   | What it does                                                                                                  |
| ------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `test.yml`                | pull requests, pushes to `main`                           | `pnpm test` on Node 22 and 24 (Ubuntu) and Node 24 (Windows), and a conditional build                         |
| `lint.yml`                | pull requests and pushes that touch code, docs, or config | `pnpm run lint`                                                                                               |
| `cspell-action.yml`       | pull requests, pushes to `main`                           | Spell checks the changed files                                                                                |
| `autofix.yml`             | pull requests                                             | Runs `lint:fix` and `sort`, and pushes the fixes through autofix.ci, unless the PR has the `no-autofix` label |
| `build-dictionaries.yml`  | pushes to `main`, manual                                  | Sorts sources, runs a conditional build, and opens a "Build Dictionaries" PR with any changes                 |
| `update-dictionaries.yml` | weekly, manual                                            | Runs every package's `update-dictionary` script and opens an "Update Dictionaries" PR                         |
| `update-readme.yml`       | pushes to `main`, manual                                  | Updates contributors, runs `build:readme`, and opens an "Update README.md" PR                                 |
| `update-dependencies.yml` | pushes to `main` that touch dependencies, weekly, manual  | Updates dependencies, regenerates `release-please-config.json`, and opens a PR                                |
| `update-dependabot.yml`   | daily, manual                                             | Updates `.github/dependabot.yaml` and opens a PR                                                              |
| `release-please.yml`      | pushes to `main`, manual                                  | Maintains the release PR, and publishes when a release is created (see [Releasing](./releasing.md))           |
| `publish.yml`             | called by `release-please.yml`, manual                    | Publishes changed packages to npm                                                                             |
| `codeql-analysis.yml`     | pull requests, pushes to `main`, weekly                   | CodeQL analysis                                                                                               |

Dependabot (`.github/dependabot.yaml`) opens dependency and GitHub Actions update PRs.
