# Releasing

How packages in this repo get versioned and published. Nothing here is done by hand: Conventional Commits drive it.
See [Commits and pull requests](./commits-and-pull-requests.md) for which type to use.

## The flow

1. **Release Please keeps a release PR open.** On every push to `main`, `.github/workflows/release-please.yml` updates a
   PR titled `chore: release main`. It bumps the version and writes the `CHANGELOG.md` of each package with
   releasable commits since its last release. Each commit counts for the packages whose files it changed.
2. **Merging the release PR creates the releases.** Release Please tags each released package as
   `<package name>@<version>` and records the versions in `.release-please-manifest.json`.
3. **The same workflow publishes.** When a release was created, `release-please.yml` calls `publish.yml`, which runs
   `lerna publish from-package`. It publishes every package whose `package.json` version isn't on npm yet, and skips
   packages marked `private: true`.

## Rules

- **`release-please-config.json` is generated.** Never edit it by hand. `scripts/gen-release-please-config.sh` writes
  it from `scripts/gen-release-please-config.jq` (the settings, including `changelog-sections`) and every
  `dictionaries/*/package.json` and `packages/*/package.json`. The Update Dependencies workflow runs the script, so a
  new package is added to the config the next time that workflow runs. To add it sooner, run
  `./scripts/gen-release-please-config.sh` (it needs `jq`) and commit the result.
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
rights, and the packages set `publishConfig.provenance`, which npm only supports from a CI provider such as GitHub
Actions. Prefer the workflow.
