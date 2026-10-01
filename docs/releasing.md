# Releasing

> [!WARNING]
> These instructions are for maintainers. Contributors don't need to do any of this: releases and publishing are
> handled by maintainers and workflows.

How packages in this repo get versioned and published. Conventional Commits drive it. The only step done by hand is a
new package's first publish (see [New packages](#new-packages)).
See [Commits and pull requests](./commits-and-pull-requests.md) for which type to use.

## The flow

1. **Release Please keeps a release PR open.** On every push to `main`, `.github/workflows/release-please.yml` updates a
   PR titled `chore: release main`. It bumps the version and writes the `CHANGELOG.md` of each package with
   releasable commits since its last release. Each commit counts for the packages whose files it changed. The
   `node-workspace` plugin also bumps every package that depends on a bumped package, such as
   `@cspell/dict-cspell-bundle`, with a "workspace dependencies were updated" changelog entry.
2. **Merging the release PR creates the releases.** Release Please tags each released package as
   `<package name>@<version>` and records the versions in `.release-please-manifest.json`.
3. **The same workflow publishes.** When a release was created, `release-please.yml` calls `publish.yml`, which runs
   `lerna publish from-package`. It publishes every package whose `package.json` version isn't on npm yet, and skips
   packages marked `private: true`.

## Rules

- **`release-please-config.json` is generated.** Never edit it by hand. `pnpm run gen:release-please-config` writes it
  from the settings in `scripts/gen-release-please-config.mts`, including `changelog-sections`, and every
  `dictionaries/*/package.json` and `packages/*/package.json`.
  - `pnpm run lint` runs it, and so does autofix on pull requests, so a new package is added in the PR that creates it.
  - `pnpm run lint-ci` fails if the committed file is out of date.
  - Private packages are included on purpose. When one is released, the `node-workspace` plugin also releases the
    packages that depend on it, such as the English dictionaries that build from `@cspell/aoo-mozilla-en-dict`.
- **The `"."` entry always stays.** It is the root `cspell-dicts` package, which is private and never published.
- **Never add a new package to `.release-please-manifest.json`.** The manifest records each package's last released
  version. Release Please adds a new package on its first release, using the version in its `package.json`
  (`1.0.0` for a package made by the generator). Seeding the manifest by hand makes the first release land above it.
- **A new package is private until a maintainer verifies it.** The generator creates it with `private: true` and
  "-- Private until verified" in `description`. Contributors leave both. A maintainer removes them in a separate PR.
  See [New packages](#new-packages).

## Trusted Publishing

For security, every package is published with [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers), from
this repo's Publish to NPM workflow (`publish.yml`).

### Setting up Trusted Publishing

Each package has to trust that workflow on npm. The script `scripts/npm-trusted-publishing.mts` sets that up, run as
`pnpm run trusted-publishing`. With no package names, it does every public package under `dictionaries/` and
`packages/`.

- **Add:** `pnpm run trusted-publishing [<package>...]` adds `publish.yml` in `streetsidesoftware/cspell-dicts` as a
  trusted publisher where it's missing.
- **Check:** `pnpm run trusted-publishing --check [<package>...]` reports whether each package has that trusted
  publisher and how its latest version was published. It exits 1 if any package isn't set up or was last published
  with a token.
- **Block tokens:** `pnpm run trusted-publishing --mfa [<package>...]` requires 2FA and disallows tokens for publishing
  each package.

When you run it:

- Add `--dry-run` to see the changes without making them.
- Log in first with `npm login --auth-type=web`. It needs npm rights for the packages.
- npm opens a browser page for 2FA. Choose to skip 2FA for the next 5 minutes.
- It pauses 2 seconds between packages, so about 40 packages fit in one window. Run it again after the window ends: it
  skips packages that are already set up.
- Use the `--mfa` option only after every package publishes through Trusted Publishing. Once a package disallows
  tokens, only Trusted Publishing or a maintainer with 2FA can publish it.
- A new package's first version is published by hand. See [New packages](#new-packages).

### New packages

A new package stays private through its first PRs. Once it has been verified, a maintainer with npm publish rights for
`@cspell` makes it public in a `chore:` PR, such as `chore(<name>): publish`. That PR:

- sets `private` to `false`
- removes "-- Private until verified" from `description`
- adds the package to `@cspell/dict-cspell-bundle`, if it should be there: add it to `dependencies` in
  `dictionaries/cspell/package.json` as `"workspace:^"`, then run `pnpm run build` in `dictionaries/cspell`. Whether
  cspell itself bundles it is decided in the [cspell](https://github.com/streetsidesoftware/cspell) repo.

Trusted Publishing only works for a package that is already on npm, so the maintainer publishes its first version by
hand, right after that PR is merged.

#### 1. Merge the PR

Merge the PR that makes the package public, then update your checkout:

```sh
git switch main
git pull
```

#### 2. Log in to npm

```sh
npm login --auth-type=web
```

- npm opens a browser page to log in, with 2FA.
- Check that `npm whoami` shows your npm user name.

#### 3. Publish it

In the package directory, on `main`:

```sh
pnpm pack
npm publish <package tarball>.tgz --provenance=false
```

- The pack step replaces `workspace:` versions with real ones.
- The `--provenance=false` option is needed because npm only creates provenance in CI.
- npm asks for 2FA.

#### 4. Add the trusted publisher

From the repo root:

```sh
pnpm run trusted-publishing <package name>
```

- Check that the package is on npmjs.com at the version in its `package.json`.
- Check that `pnpm run trusted-publishing --check <package name>` reports `trusted publisher yes`.

CI publishes later versions through Trusted Publishing.

## Fixing a changelog entry after merge

If a PR merged with the wrong type, correct it on the merged PR, never on the release PR, which is regenerated on every
run. Add a block like this to the end of the merged PR's description:

```text
BEGIN_COMMIT_OVERRIDE
chore: corrected commit message
END_COMMIT_OVERRIDE
```

Release Please uses it instead of the commit message the next time it runs. It works only for squash-merged PRs.

## When publishing fails

1. Fix the reason it failed.
2. Run the Publish to NPM workflow (`publish.yml`) by hand. It publishes whatever isn't on npm yet, so it is safe to
   run again.

`pnpm run pub-recover` runs the same `lerna publish from-package` locally, one package at a time. It needs npm publish
rights, and the packages set `publishConfig.provenance`, which npm only supports from a cloud-hosted CI runner such as
GitHub Actions ([npm docs](https://docs.npmjs.com/generating-provenance-statements)). Prefer the workflow.
