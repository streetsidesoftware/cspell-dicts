# Releasing

> [!WARNING]
> These instructions are for maintainers. Contributors don't need to do any of this: maintainers and workflows handle
> releases and publishing.

Versions and changelogs come from commit types, so see [Commits and pull requests](./commits-and-pull-requests.md) for
which type to use. Releases and publishing run in CI. Publishing a new dictionary for the first time and setting up its
Trusted Publishing must be done by hand (see [New dictionaries](#new-dictionaries)).

## How a release happens

1. **A release PR shows exactly what will be released.** Nothing is released until the `chore: release main` PR is
   merged, so every release is reviewed first. On every push to `main`, Release Please
   (`.github/workflows/release-please.yml`) updates the PR. For each package with `feat:` or `fix:` commits since its
   last release, or other types that show in the changelog, the PR bumps the version, adds the commits to the
   package's `CHANGELOG.md`, and records the new version in `.release-please-manifest.json`.
   - A commit belongs to every package whose files it changes.
   - The `node-workspace` plugin also bumps the packages that depend on a bumped package, such as
     `@cspell/dict-cspell-bundle`, with a "workspace dependencies were updated" entry.
2. **Release Please creates the releases once the `chore: release main` PR has been merged.** Each package gets its own
   GitHub release, tagged `<package name>@<version>`.
3. **The publishing workflow is triggered by the creation of a release tag.** Each release also tags the root package as
   `cspell-dicts@<version>`, and creating that tag triggers the Publish to NPM workflow (`publish.yml`). The workflow runs
   `lerna publish from-package`, which publishes every public package whose version isn't on npm yet.
   - Release Please pushes the tags with a GitHub App token, because a tag created with the default
     `GITHUB_TOKEN` doesn't trigger other workflows.

## Rules

- **Don't edit `release-please-config.json` by hand.** It's generated. See
  [The Release Please config](#the-release-please-config).
- **Don't edit `.release-please-manifest.json` by hand.** Release Please updates it on every release, and the config
  script adds new packages to it.
- **Keep the `"."` entry in both files.** It's the root `cspell-dicts` package, which is private and never published.
- **New dictionaries start private.** The generator sets `private: true` and adds "-- Private until verified" to
  `description`. Contributors leave both, and a maintainer removes them. See [New dictionaries](#new-dictionaries).

## The Release Please config

`pnpm run gen:release-please-config` writes `release-please-config.json`. It reads the settings in
`scripts/gen-release-please-config.mts`, including `changelog-sections`, and every `dictionaries/*/package.json` and
`packages/*/package.json`. It also adds new packages to `.release-please-manifest.json`, at the version in their
`package.json`.

- The Update Release Please Config workflow runs it when the manifest or a package's `package.json` changes on `main`,
  and opens a `chore:` PR with the result. Pull requests don't run it.
- Private packages are in the config on purpose. When one is released, the `node-workspace` plugin releases the packages
  that depend on it, such as the English dictionaries built from `@cspell/aoo-mozilla-en-dict`.

## Release a package at a set version

Set the package's `release-as`, with either:

- the Set Dictionary Version release-as workflow, from the Actions tab
- `pnpm run release-as <package> --version <version>`

The release happens with the next `fix:` or `feat:` change in the package's directory, such as a Build Dictionaries bot
PR. After the release, the Update Release Please Config workflow opens a PR that removes `release-as`. If that PR
doesn't appear, run the workflow from the Actions tab.

## Try changes as alphas

To try risky changes to a dictionary, set its `release-as` to a prerelease version, such as `3.2.0-alpha.0`.

- CI publishes prerelease versions under the npm `alpha` tag. Users who install the package still get the `latest`
  version.
- Later releases stay alphas, such as `3.2.1-alpha.0`, until you set `release-as` to a final version, such as `3.2.0`.

## New dictionaries

A new dictionary starts private, at version `0.0.1-alpha.0`. While it's private, Release Please may release alpha
versions of it, but CI doesn't publish them. Once the dictionary has been verified, a maintainer with npm publish rights
for `@cspell` makes it public.

[Trusted Publishing](#trusted-publishing) only works for a package that's already on npm. So the maintainer publishes
the first version by hand, as an alpha, and CI publishes every version after it, starting with `1.0.0`.

### 1. Open the publication PR

From the Actions tab, run the Prepare a New Dictionary for Publication workflow with the dictionary's directory under
`dictionaries/`, such as `matlab`. It opens a `feat(<name>): publish the <name> dictionary` PR that:

- removes `private` and "-- Private until verified" from `package.json`
- sets the dictionary's `release-as` to `1.0.0`
- lists the commands for steps 2 and 3 as a checklist

### 2. Publish the first version by hand

Follow the checklist in the PR. It covers:

- checking out only the PR's branch, since the repo is large
- logging in to npm
- building and packing the dictionary, then publishing it as an alpha
- adding the trusted publisher with `pnpm trusted-publishing`
- committing `static/published.json`, where that script records the trusted publisher, and pushing it to the PR

Why some of those steps are there:

- **Pack, then publish the tarball:** `pnpm pack` replaces `workspace:` versions with real ones. Check the files it
  lists: built files that git ignores, such as `dict/*.txt.gz`, must be there.
- **`--tag alpha`:** npm requires a tag for a prerelease version, and it keeps `latest` for `1.0.0`.
- **`--provenance=false`:** the packages set `publishConfig.provenance`, but npm only creates provenance in CI.

### 3. Merge

- Merge the PR. Its `feat:` commit changes the dictionary, so the release PR includes it, at `1.0.0`.
- Merge the release PR. CI publishes `1.0.0` through Trusted Publishing, with provenance, as `latest`.
- The Update Release Please Config workflow then opens a PR that removes `release-as`. Merge it.

### Later: add it to the bundle

Add a dictionary to `@cspell/dict-cspell-bundle` only after the [cspell](https://github.com/streetsidesoftware/cspell)
repo decides to bundle it. Then:

- add it to `dependencies` in `dictionaries/cspell/package.json` as `"workspace:^"`
- run `pnpm run build` in `dictionaries/cspell`

## Trusted Publishing

Every dictionary is published by this repo's Publish to NPM workflow (`publish.yml`) through
[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers), which uses short-lived credentials from GitHub
instead of a stored npm token.

### Setting up Trusted Publishing

Each dictionary must name `publish.yml` as its trusted publisher on npm. `pnpm run trusted-publishing`
(`scripts/npm-trusted-publishing.mts`) sets that up. Give it package names, such as `@cspell/dict-git`, or `--all` for
every public dictionary. In a dictionary's directory, it works on that dictionary when you give it no names.

- **Add:** `pnpm run trusted-publishing (<package>... | --all)` adds the trusted publisher where it's missing. It skips
  dictionaries already recorded in `static/published.json`.
- **Check:** `pnpm run trusted-publishing --check (<package>... | --all)` reports whether each dictionary has the
  trusted publisher, and whether its latest version was published by CI or with a token. It exits 1 if any dictionary
  isn't set up or was last published with a token. It asks npm about every dictionary, recorded or not.
- **Block tokens:** `pnpm run trusted-publishing --mfa (<package>... | --all)` requires 2FA and disallows tokens for
  publishing each dictionary.

To run it:

- Log in first with `npm login --auth-type=web`. You need npm publish rights for `@cspell`.
- When npm opens a browser page for 2FA, check the box to skip 2FA for the next 5 minutes.
- It pauses 2 seconds between dictionaries, so one 5-minute window covers about 40 to 80 of them. When the window ends,
  run it again: it skips dictionaries that are already set up.
- Add `--dry-run` to see the changes without making them.
- Afterwards, commit `static/published.json`. The script records each dictionary it finds or sets up there, as
  `"@cspell/dict-<name>": { "trustedPublishing": true }`, so the next run only checks new dictionaries.

Use `--mfa` only after every dictionary publishes through Trusted Publishing. After that, only Trusted Publishing or a
maintainer with 2FA can publish it.

## Fixing a changelog entry after merge

If a PR was merged with the wrong type, correct it on the merged PR. Don't edit the release PR: Release Please rewrites
it on every run. Add a block like this to the end of the merged PR's description:

```text
BEGIN_COMMIT_OVERRIDE
chore: corrected commit message
END_COMMIT_OVERRIDE
```

The next time Release Please runs, it uses that message instead of the commit's. This only works for squash-merged PRs.

## When publishing fails

1. Fix the cause.
2. Run the Publish to NPM workflow (`publish.yml`) from the Actions tab. It publishes only the versions that aren't on
   npm yet, so running it again is safe.

`pnpm run pub-recover` runs the same `lerna publish from-package` on your machine, one package at a time. It needs npm
publish rights. It fails for packages that set `publishConfig.provenance`, because npm only creates provenance on a
cloud-hosted CI runner such as GitHub Actions ([npm docs](https://docs.npmjs.com/generating-provenance-statements)).
