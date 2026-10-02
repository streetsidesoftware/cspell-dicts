# Releasing

> [!WARNING]
> These instructions are for maintainers. Contributors don't need to do any of this: releases and publishing are
> handled by maintainers and workflows.

How packages in this repo get versioned and published. Conventional Commits drive it. The only steps done by hand are a
new dictionary's first alpha publish and its trusted publisher (see [New dictionaries](#new-dictionaries)).
See [Commits and pull requests](./commits-and-pull-requests.md) for which type to use.

## The flow

1. **Release Please keeps a release PR open.** On every push to `main`, `.github/workflows/release-please.yml` updates a
   PR titled `chore: release main`. It bumps the version and writes the `CHANGELOG.md` of each package with
   releasable commits since its last release. Each commit counts for the packages whose files it changed. The
   `node-workspace` plugin also bumps every package that depends on a bumped package, such as
   `@cspell/dict-cspell-bundle`, with a "workspace dependencies were updated" changelog entry.
2. **Merging the release PR creates the releases.** Release Please tags each released package as
   `<package name>@<version>` and records the versions in `.release-please-manifest.json`.
3. **The release tag starts publishing.** Every release also tags the root package as `cspell-dicts@<version>`. That tag
   starts `publish.yml`, which runs `lerna publish from-package`. Release Please pushes it with a GitHub App token,
   because a tag pushed with the default `GITHUB_TOKEN` doesn't start other workflows. The publish covers every package
   whose `package.json` version isn't on npm yet, and skips packages marked `private: true`.

## Rules

- **`release-please-config.json` is generated.** Do not edit it by hand.
  `pnpm run gen:release-please-config` writes it from the settings in `scripts/gen-release-please-config.mts`,
  including `changelog-sections`, and every `dictionaries/*/package.json` and `packages/*/package.json`.
  - The Build Dictionaries workflow runs it after each push to `main`, and the Clear release-as workflow runs it when
    the manifest changes on `main`, such as after a release. Each opens a PR with any change. Pull requests don't
    run it.
  - It also adds each new package to `.release-please-manifest.json`, with the version in its `package.json`.
  - To release a package at a set version, such as a new dictionary's `1.0.0`, run the Set Dictionary Version release-as workflow
    from the Actions tab, or `pnpm run release-as <package> --version <version>`. Both set the package's
    `release-as`. The release itself comes with the next `fix:` or `feat:` change inside the package's directory,
    such as a Build Dictionaries bot PR. The script keeps `release-as` until the manifest shows that version was
    released, so the Clear release-as workflow's PR right after the release removes it. If that PR is missed, run
    Clear release-as from the Actions tab.
  - To try risky changes to a dictionary, put it in alpha mode: set `release-as` to a prerelease version, such as
    `3.2.0-alpha.0`. CI publishes prerelease versions under the npm `alpha` tag, so `latest`, and what users
    install, doesn't change. After that release, later releases stay alphas, such as `3.2.1-alpha.0`, until
    `release-as` is set to the final version, such as `3.2.0`.
  - Private packages are included on purpose. When one is released, the `node-workspace` plugin also releases the
    packages that depend on it, such as the English dictionaries that build from `@cspell/aoo-mozilla-en-dict`.
- **The `"."` entry always stays.** It is the root `cspell-dicts` package, which is private and never published.
- **Don't edit `.release-please-manifest.json` by hand.** It records each package's last released version. Release
  Please updates it on every release, and the config script adds new packages.
- **A new dictionary is private until a maintainer verifies it.** The generator creates it with `private: true` and
  "-- Private until verified" in `description`. Contributors leave both. A maintainer removes them with the
  Prepare Dictionary for Publication workflow.
  See [New dictionaries](#new-dictionaries).

## New dictionaries

A new dictionary starts private, at version `0.0.1-alpha.0`. Release Please may release it as alpha versions while it
is private, but nothing is published. Once it has been verified, a maintainer with npm publish rights for `@cspell`
makes it public.

[Trusted Publishing](#trusted-publishing) only works for a dictionary that is already on npm, so the maintainer
publishes an alpha version by hand first. CI publishes `1.0.0`.

### 1. Open the PR

Run the Prepare Dictionary for Publication workflow from the Actions tab, with the dictionary's directory under
`dictionaries/`, such as `perl`. It opens a `feat(<name>): publish the <name> dictionary` PR that:

- removes `private` and "-- Private until verified" from `package.json`
- sets the dictionary's `release-as` to `1.0.0`

The workflow runs `pnpm prepare-publication`. To do the same by hand, run it in the dictionary's directory and open the
PR yourself.

### 2. Publish an alpha version

Log in to npm first, with `npm login --auth-type=web`. Then, from a checkout of the PR's branch, do every step in the
dictionary's directory, as the PR's checklist lists them:

```sh
cd dictionaries/<name>
pnpm install
pnpm run prepare:dictionary
pnpm pack
npm publish <the .tgz pnpm pack printed> --tag alpha --provenance=false
pnpm trusted-publishing
```

- Check the packed files with `tar -tzf <the .tgz>` before publishing: built files that git ignores, such as
  `dict/*.gz`, must be there.
- The `--tag alpha` option is needed because npm requires a tag for a prerelease version.
- The `--provenance=false` option is needed because npm only creates provenance in CI.
- Check that `pnpm trusted-publishing --check` in the same directory reports `trusted publisher yes`.

### 3. Merge

- Merge the PR. As a `feat:` with `release-as`, it puts the dictionary in the release PR at `1.0.0`.
- Merge the release PR. CI publishes `1.0.0` through Trusted Publishing, with provenance.
- The Clear release-as workflow then opens a PR that removes `release-as`. Merge it.

### Later: add it to the bundle

Add a dictionary to `@cspell/dict-cspell-bundle` only after the [cspell](https://github.com/streetsidesoftware/cspell)
repo decides to bundle it. Then:

- add it to `dependencies` in `dictionaries/cspell/package.json` as `"workspace:^"`
- run `pnpm run build` in `dictionaries/cspell`

## Trusted Publishing

For security, every dictionary is published with
[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers), from this repo's Publish to NPM workflow
(`publish.yml`).

### Setting up Trusted Publishing

Each dictionary has to trust that workflow on npm. The script `scripts/npm-trusted-publishing.mts` sets that up, run as
`pnpm run trusted-publishing`. Give it package names, such as `@cspell/dict-git`, or `--all` for every public
dictionary. In a dictionary's directory, `pnpm trusted-publishing` with no names works on that dictionary. Anywhere
else, with neither, it prints its usage.

- **Add:** `pnpm run trusted-publishing (<package>... | --all)` adds `publish.yml` in
  `streetsidesoftware/cspell-dicts` as a trusted publisher where it's missing. It skips dictionaries recorded in
  `static/published.json` without asking npm.
- **Check:** `pnpm run trusted-publishing --check (<package>... | --all)` reports whether each dictionary has that
  trusted publisher and how its latest version was published. It exits 1 if any dictionary isn't set up or was last
  published with a token. It asks npm about every dictionary, recorded or not.
- **Block tokens:** `pnpm run trusted-publishing --mfa (<package>... | --all)` requires 2FA and disallows tokens for
  publishing each dictionary.

When you run it:

- Add `--dry-run` to see the changes without making them.
- Log in first with `npm login --auth-type=web`. It needs npm publish rights for `@cspell`.
- npm opens a browser page for 2FA. Choose to skip 2FA for the next 5 minutes.
- It pauses 2 seconds between dictionaries, so a window fits about 40 to 80 of them. Run it again after the window
  ends: it skips dictionaries that are already set up.
- It records each dictionary it finds or sets up in `static/published.json`, as
  `"@cspell/dict-<name>": { "trustedPublishing": true }`. Commit that file after a run, so the next run only touches
  new dictionaries.
- Use the `--mfa` option only after every dictionary publishes through Trusted Publishing. Once a dictionary disallows
  tokens, only Trusted Publishing or a maintainer with 2FA can publish it.
- A new dictionary's first alpha version is published by hand. See [New dictionaries](#new-dictionaries).

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
