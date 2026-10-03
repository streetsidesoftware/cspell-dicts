# Releasing

<!--
audience: maintainer
kind: guide
level: has write access and an npm account with publish rights; runs git, gh, and npm
-->

> [!WARNING]
> These instructions are for maintainers. Contributors don't need to do any of this: maintainers and workflows handle
> releases and publishing.

Releases and publishing run in CI. Publishing a new dictionary for the first time and setting up its Trusted Publishing
must be done by hand (see [New dictionaries](#new-dictionaries)).

## How a release happens

1. **Changes collect in a release PR.** The `chore: release main` PR shows every package that will be released, with
   its new version and changelog. Release Please updates it after each merge to `main`. Nothing is released until the
   PR is merged.
2. **Release Please creates the releases once the release PR has been merged.** Each package gets its own GitHub
   release, tagged `<package name>@<version>`.
3. **CI publishes them.** Creating the release tags triggers the [Publish to NPM](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/publish.yml) workflow, which publishes the new
   versions to npm.

A `feat:` or `fix:` change marks the packages whose files it touches for the next release. `chore:`, `docs:`, and the
other hidden types never do. See [Commits and pull requests](./commits-and-pull-requests.md).

## Rules

- **Don't edit `release-please-config.json` or `.release-please-manifest.json` by hand.** The [Update Release Please Config](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-release-please-config.yml) workflow keeps both up to date: when a package is added or released, it opens a `chore:` PR. Merge it.
- **Don't edit the `chore: release main` PR.** Release Please rewrites it on every run, so edits are lost. To correct a
  changelog entry, see [Fixing a changelog entry after merge](#fixing-a-changelog-entry-after-merge).
- **New dictionaries start private.** `pnpm run create-dictionary` sets `private: true` and adds "-- Private until verified" to
  `description`. Contributors leave both, and a maintainer removes them. See [New dictionaries](#new-dictionaries).

## Release a package at a set version

To release a package at a version you choose, such as `1.0.0` or `3.2.0-alpha.0`, run the
[Set Dictionary Version release-as](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/release-dictionary.yml) workflow, or `pnpm run release-as <package> --version <version>`.

After the release, remember to merge the PR that the [Update Release Please Config](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-release-please-config.yml) workflow opens to remove
`release-as`.

## Try changes as alphas

To try risky changes to a dictionary, release it at a prerelease version, such as `3.2.0-alpha.0` (see
[Release a package at a set version](#release-a-package-at-a-set-version)).

- CI publishes prerelease versions under the npm `alpha` tag. Users who install the package still get the `latest`
  version.
- Later releases stay alphas, such as `3.2.1-alpha.0`. To end the alphas, release the latest alpha's version without
  `-alpha`, such as `3.2.1`.

## New dictionaries

A new dictionary starts private, at version `0.0.1-alpha.0`, and isn't published. Once it has been verified, a
maintainer with npm publish rights for `@cspell` makes it public.

[Trusted Publishing](#trusted-publishing) only works for a package that's already on npm. So the maintainer publishes
the first version by hand, as an alpha, and CI publishes every version after it, starting with `1.0.0`.

### 1. Open the publication PR

Run the [Prepare a New Dictionary for Publication](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/prepare-publication.yml) workflow with the dictionary's directory under
`dictionaries/`, such as `matlab`. It opens a `feat(<name>): publish the <name> dictionary` PR that:

- makes the dictionary public
- sets its `release-as` to `1.0.0`
- lists the commands for steps 2 and 3 as a checklist

### 2. Publish the first version by hand

Follow the checklist in the PR. It covers:

- checking out only the PR's branch
- logging in to npm
- building and packing the dictionary, then publishing it as an alpha
- adding the trusted publisher
- committing the Trusted Publishing status to the PR

Before publishing, check the files `pnpm pack` lists: built files that git ignores, such as `dict/*.txt.gz`, must be
there.

### 3. Merge

- Merge the PR. The release PR then includes the dictionary at `1.0.0`.
- Merge the release PR. CI publishes `1.0.0` through Trusted Publishing.
- Remember to merge the PR that the [Update Release Please Config](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/update-release-please-config.yml) workflow opens to remove `release-as`.

### Later: add it to the bundle

Add a dictionary to `@cspell/dict-cspell-bundle` only after the [cspell](https://github.com/streetsidesoftware/cspell)
repo decides to bundle it. Then:

- add it to `dependencies` in `dictionaries/cspell/package.json` as `"workspace:^"`
- run `pnpm run build` in `dictionaries/cspell`

## Trusted Publishing

Every dictionary is published by this repo's [Publish to NPM](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/publish.yml) workflow through
[npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers), with no stored npm token. Each dictionary has to
name that workflow as its trusted publisher on npm.

`pnpm run trusted-publishing` manages that. Give it package names, such as `@cspell/dict-git`, or `--all`. In a
dictionary's directory, it works on that dictionary when you give it no names.

- **Add:** `pnpm run trusted-publishing <package>` adds the trusted publisher where it's missing.
- **Check:** `pnpm run trusted-publishing --check <package>` reports whether a dictionary has the trusted publisher,
  and whether its latest version was published by CI.
- **Block tokens:** `pnpm run trusted-publishing --mfa <package>` stops anyone from publishing the dictionary with a
  token. Use it only after every dictionary publishes through Trusted Publishing.

To run it:

1. Log in with `npm login --auth-type=web`. You need npm publish rights for `@cspell`.
2. When npm asks for 2FA in the browser, check the box to skip 2FA for the next 5 minutes. If the 5 minutes run out
   before it finishes, run it again: it skips dictionaries that are already set up.
3. Commit `static/published.json`, where the script records the dictionaries it set up.

## What gets published

Each package's `files` field lists what npm publishes: `cspell-ext.json` and the built dictionary. New dictionaries
publish the compressed file, such as `dict/<name>.txt.gz`. Word lists in `src/` aren't published, but upstream license
files are, such as `src/hunspell/license`. See [Dictionary packages](./dictionary-packages.md).

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
2. Run the [Publish to NPM](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/publish.yml) workflow. It publishes only the versions that aren't on npm yet, so
   running it again is safe.

Don't publish from your machine instead: the packages require provenance, which npm only creates in CI.
