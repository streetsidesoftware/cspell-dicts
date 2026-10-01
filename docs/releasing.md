# Releasing

How packages in this repo get versioned and published. Nothing here is done by hand: Conventional Commits drive it.
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
- **A new package is private until it is ready.** The generator creates it with `private: true`. Set it to `false`
  when the package should be published.

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
