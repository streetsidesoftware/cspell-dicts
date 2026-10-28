# Repository

<!--
audience: developer
kind: reference
level: reads and writes TypeScript, package.json scripts, and GitHub Actions workflows
-->

> [!NOTE]
> For developers working on the repo's scripts, packages, configs, and CI. Anyone who clones the repo needs
> [Prerequisites](#prerequisites).

How the repo is set up: the tools it needs, the workspace, the files that are generated, and CI. For what's inside a
dictionary package, see [Dictionary packages](./dictionary-packages.md).

## Prerequisites

- **Node.js:** the version `engines` in the root `package.json` requires. The Node versions CI tests on are in
  `.github/workflows/test.yml`.
- **pnpm through Corepack.** The root `package.json` pins the pnpm version in `packageManager`, and Corepack provides
  exactly that version. Enable it once:

  ```sh
  corepack enable
  ```

- **Symlinks on Windows, if you use Claude Code.** The repo's skills live in `.agents/skills/`, and the
  `.claude/skills` folder is a symlink to it. Without symlinks, Git checks it out as a plain text file, and Claude Code
  finds none of the skills. Git for Windows creates symlinks only when Developer Mode is on in Windows Settings, so turn
  it on before you clone. If `.claude/skills` is still a plain text file, clone again with symlinks turned on:

  ```sh
  git clone -c core.symlinks=true https://github.com/streetsidesoftware/cspell-dicts.git
  ```

## Workspace

This is a pnpm workspace. pnpm is the only package manager allowed: the root `preinstall` script rejects npm and yarn.
`pnpm-workspace.yaml` lists the workspace packages:

- `dictionaries/*`: one package per dictionary, published as `@cspell/dict-<name>` (a few older packages have other
  names, such as `@cspell/aoo-mozilla-en-dict`). These are what users install.
- `dictionaries/*/scripts`: helper packages for dictionaries that need their own scripts to fetch or build sources.
- `packages/*`: internal packages, such as `@internal/en-freq` and `@internal/create-dictionary` (behind
  `pnpm create-dictionary`). Not published.
- `scripts`: repo-level tooling (`cspell-dicts-scripts`, private): README generation, sorting, syncing upstream files.
- `cspell-dict-file-checker`: a private tool that checks files against a snapshot.

### Scripts

Write repo scripts in TypeScript, as `.mts` files run with `node`, such as `scripts/gen-release-please-config.mts`. Node
runs them directly, without a build step. Don't add shell scripts or `jq` filters: contributors build on Windows too.

- `pnpm run check:types` type-checks `scripts/` and `dictionaries/*/scripts/` with the root `tsconfig.json`. It also
  rejects syntax that Node can't run without a build, such as `enum`. `pnpm run lint` and `pnpm run lint-ci` run it.
- Shared dev tools, such as `typescript`, `@types/node` and `@tsconfig/node22`, are declared only in the root
  `package.json`.

## Commands for every package

From the repo root:

```sh
pnpm install
pnpm run prepare:dictionaries   # build what each package needs before it can be used or tested
pnpm test                       # every package's test script
pnpm test:packages              # the tests of the internal packages in packages/
```

Packages in `packages/` keep their tests in a `test:package` script, so `pnpm test` skips them: their `test` script
only points to it. Run `pnpm test:package` inside one of them, or `pnpm test:packages` at the root for all of them.

- `pnpm run build` at the root runs `setup` (install and `prepare:dictionaries`) and then a conditional build of every
  package. It can take a long time. To build one dictionary, see
  [Dictionary packages](./dictionary-packages.md#building).
- `pnpm run build:all` rebuilds every package, ignoring `checksum.txt`. It is slower still.
- `pnpm run sort` sorts the source word lists listed in `sort-source.config.json`.

## Generated files

Never edit these by hand. Change the source, then regenerate.

| Generated                                                                                                                                            | Regenerate with                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dictionaries/*/dict/*`, and `.trie` files at a package root                                                                                         | `pnpm run build` in `dictionaries/<name>`                                                                                                                                                            |
| `checksum.txt`                                                                                                                                       | The package build                                                                                                                                                                                    |
| `dictionaries/cspell/cspell-ext.json` → `import`                                                                                                     | `pnpm run build` in `dictionaries/cspell`                                                                                                                                                            |
| Upstream files and their `.sync-github-files.json`                                                                                                   | `pnpm run sync` in the package, which fetches them, such as `src/hunspell/` (see [Upstream updates](./guides/upstream-updates.md))                                                                   |
| `dictionaries/*/static/`                                                                                                                             | `pnpm run build:readme`                                                                                                                                                                              |
| `static/dictionary-packages.*`                                                                                                                       | `pnpm run build:readme`                                                                                                                                                                              |
| `static/contributors.*`                                                                                                                              | `update-contributors`, run by the [Update Readme](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-readme.yml) workflow                                                   |
| Anything between `@@inject` markers, in `README.md` and `dictionaries/*/README.md`, and in each dictionary's `src/README.md` and `samples/README.md` | `pnpm run build:readme`                                                                                                                                                                              |
| `CHANGELOG.md` files and `.release-please-manifest.json`                                                                                             | Release Please (see [Releasing](./releasing.md))                                                                                                                                                     |
| `release-please-config.json`                                                                                                                         | `pnpm run gen:release-please-config`, also run by the [Update Release Please Config](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-release-please-config.yml) workflow |

`pnpm run check-dirty` fails if the working tree has changes. Run it after a regenerate command to check that nothing
was left out of date.

## CI

Workflows in `.github/workflows/`:

| Workflow                                                                                                                                    | Runs on                                                                                                                      | What it does                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [`test.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/test.yml)                                                 | pull requests that change what it tests, pushes to `main`                                                                    | `pnpm test` on several Node versions and on Windows, and a conditional build                                                   |
| [`test-packages.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/test-packages.yml)                               | pull requests and pushes to `main` that change `packages/`, the root `package.json`, or `pnpm-lock.yaml`                     | `pnpm test:packages` on the same Node versions and systems as `test.yml`                                                       |
| [`lint.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/lint.yml)                                                 | pull requests and pushes that touch code, docs, or config                                                                    | `pnpm run lint-ci`: ESLint, Prettier, TypeScript type check, and cspell, without fixing                                        |
| [`cspell-action.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/cspell-action.yml)                               | pull requests, pushes to `main`                                                                                              | Spell checks the changed files                                                                                                 |
| [`autofix.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/autofix.yml)                                           | pull requests                                                                                                                | Runs `lint:fix` and `sort`, and pushes the fixes through autofix.ci, unless the PR has the `no-autofix` label                  |
| [`build-dictionaries.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/build-dictionaries.yml)                     | pushes to `main`, manual                                                                                                     | Normalizes `package.json` files, sorts sources, runs a conditional build, and opens a "Build Dictionaries" PR with any changes |
| [`update-dictionaries.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-dictionaries.yml)                   | weekly, manual                                                                                                               | Runs every package's `update-dictionary` script and opens an "Update Dictionaries" PR                                          |
| [`update-readme.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-readme.yml)                               | pushes to `main`, manual                                                                                                     | Updates contributors, runs `build:readme`, and opens an "Update README.md" PR                                                  |
| [`update-dependencies.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-dependencies.yml)                   | pushes to `main` that touch dependencies, weekly, manual                                                                     | Updates dependencies and opens a PR                                                                                            |
| [`update-dependabot.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-dependabot.yml)                       | daily, manual                                                                                                                | Updates `.github/dependabot.yaml` and opens a PR                                                                               |
| [`release-please.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/release-please.yml)                             | pushes to `main`, manual                                                                                                     | Creates the releases and tags once the release PR has been merged (see [Releasing](./releasing.md))                            |
| [`release-please-pr.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/release-please-pr.yml)                       | pushes to `main`, manual                                                                                                     | Maintains the release PR. Safe to re-run: it never creates releases                                                            |
| [`update-release-please-config.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-release-please-config.yml) | pushes to `main` that change the manifest or a package's `package.json`, manual                                              | Updates the Release Please config and manifest, and opens a `chore:` PR                                                        |
| [`release-dictionary.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/release-dictionary.yml)                     | manual                                                                                                                       | Opens a PR that sets a package's `release-as` (see [Releasing](./releasing.md))                                                |
| [`prepare-publication.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/prepare-publication.yml)                   | pushes to `main` that change a dictionary's `package.json`, `release-please-config.json`, or `static/published.json`, manual | Opens a `feat:` PR for each private dictionary waiting for publication (see [Releasing](./releasing.md#new-dictionaries))      |
| [`publish.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/publish.yml)                                           | `cspell-dicts@*` release tags, manual                                                                                        | Publishes changed packages to npm                                                                                              |
| [`codeql-analysis.yml`](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/codeql-analysis.yml)                           | pull requests that change code, pushes to `main`, weekly                                                                     | CodeQL analysis                                                                                                                |

Dependabot (`.github/dependabot.yaml`) opens dependency and GitHub Actions update PRs.
