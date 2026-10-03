# CLAUDE.md

Guidance for AI coding agents (Claude Code, Copilot, and others) working in this repository. `AGENTS.md` and
`.github/copilot-instructions.md` point here.

This repo is **cspell-dicts**: a pnpm monorepo of spelling dictionaries for cspell and the Code Spell Checker
extension. Each package under `dictionaries/` is published to npm, usually as `@cspell/dict-<name>`.

## Commands

A fresh clone has no `node_modules`. pnpm only: the `preinstall` script blocks npm and yarn.

```sh
pnpm install
pnpm run prepare:dictionaries      # build what every package needs before tests or cspell trace work
pnpm test                          # every package's test script; slow
pnpm run sort                      # sort the source word lists in sort-source.config.json
pnpm run lint                      # eslint --fix, prettier -w, type check, then cspell
pnpm run lint-ci                   # the same checks without fixing
pnpm run check:types               # type-check TypeScript scripts (root tsconfig.json)
pnpm run build:readme              # regenerate README sections and static/ files
pnpm run check-dirty               # fails if the working tree has changes
pnpm exec cspell trace --only-found <word>   # which dictionaries have a word
```

One package:

```sh
pnpm --filter @cspell/dict-git run build
pnpm --filter @cspell/dict-git test
```

Or `pnpm run build` and `pnpm test` inside `dictionaries/<name>/`.

- `pnpm run create-dictionary` creates a dictionary package, asking questions as it goes. Run it from the repo root.
- Don't run `pnpm run build` or `pnpm run build:all` at the root unless asked. They rebuild or sync every package.
- `pnpm run lint` writes fixes. Check the diff afterwards.
- Before finishing, run `pnpm run lint`, and `pnpm test` in each package you changed.

## Where things are

Read the doc before changing that area. These are written for people too.

- [`docs/dictionary-packages.md`](docs/dictionary-packages.md): what a dictionary package contains and why, sources,
  building, and tests.
- [`docs/repository.md`](docs/repository.md): prerequisites, the workspace, generated files, and CI.
- [`docs/guides/word-changes.md`](docs/guides/word-changes.md): where words go, the word format, and the steps.
- [`docs/guides/new-dictionary.md`](docs/guides/new-dictionary.md): creating a dictionary package.
- [`docs/guides/upstream-updates.md`](docs/guides/upstream-updates.md): `sync` scripts and upstream sources.
- [`docs/commits-and-pull-requests.md`](docs/commits-and-pull-requests.md): commit types, scopes, and PR descriptions.
- [`docs/releasing.md`](docs/releasing.md): Release Please and publishing.
- [`docs/style.md`](docs/style.md): comments, invisible characters, and writing for users.
- [`docs/glossary.md`](docs/glossary.md): dictionary package, dictionary ID, target, and other terms.

## Rules

These rules are written for people in the linked docs. Read the section before working in that area.

- **Generated files:** never edit them by hand. That includes `dict/`, `.trie` files, `checksum.txt`, synced upstream
  files, `@@inject` sections, `static/`, changelogs, and `release-please-config.json`. The list and the command for each
  are in [Generated files](docs/repository.md#generated-files).
- **Word changes:** edit `src/`, then sort, build the package, and commit `src/` and `dict/` together. Build the
  packages that read from it too. See [Word changes](docs/guides/word-changes.md).
- **Comments:** few, short, and accurate. Leave existing comments alone unless you are changing that code. See
  [Comments](docs/style.md#comments).
- **Invisible characters:** write them as escape sequences in code, config, and docs. Dictionary data keeps them
  literal. See [Invisible characters](docs/style.md#invisible-characters).
- **Audience:** before editing a doc in `docs/` or `CONTRIBUTING.md`, read the audience header under its title and
  write for that reader. A new doc gets a header. See [Audience](docs/style.md#audience).
- **Writing for users:** package READMEs are npmjs.com pages, so links are absolute `https://` URLs. See
  [Writing for users](docs/style.md#writing-for-users).
- **Licenses:** a new source's license must fit the package's. If it is missing, unclear, or would change the package's
  license, stop and tell the user. See [Creating a dictionary](docs/guides/new-dictionary.md#3-check-the-sources-and-their-license).
- **Releases:** never edit `.release-please-manifest.json` or add a new package to it. See
  [Releasing](docs/releasing.md#rules).
- **Scripts:** write them in TypeScript (`.mts`, run with `node`), not shell or `jq`. See
  [Scripts](docs/repository.md#scripts).

### Docs for people

Guides and docs for people (`CONTRIBUTING.md`, `docs/`, READMEs) never point to this file. If a guide needs something
that's only here, move it into a doc under `docs/` and link to it from both.

In guides, give each step a heading and list its checks one per item.

### Commits and pull requests

Follow [Commits and pull requests](docs/commits-and-pull-requests.md).

- Release notes are read by cspell's maintainers and users. `feat:` and `fix:` are only for changes to what a
  dictionary accepts, flags, or turns on.
- Scope is the package directory under `dictionaries/`, such as `fix(en_US): …`.
- Work on this repo's tooling, docs, or Claude Code setup is `chore:` or `docs:`.
- After pushing more commits to an open PR, check that its description still matches.
- If a PR merged under the wrong type, use the `release-notes` skill.

### Skills

- To add, remove, or fix words, use the `word-change` skill.
- To create a dictionary package, use the `new-dictionary` skill.
- To update a dictionary from its upstream source, use the `upstream-update` skill.
- For a change with more than one reasonable design, settle the design before building. The
  [ADR README](docs/ADRs/README.md) describes one way to do it, and the `feature-adr` skill runs it as an interview.

## Dependencies

Dependabot (`.github/dependabot.yaml`) and the Update Dependencies workflow open the update PRs, as `ci:`. Some
dependencies are upstream word lists (such as `dictionary-de`), so updating them changes a dictionary on its next build.
