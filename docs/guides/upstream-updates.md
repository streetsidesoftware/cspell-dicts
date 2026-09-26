# Upstream updates

How dictionaries built from an upstream source are kept up to date. An upstream source is a word list maintained
outside this repo, such as a Hunspell dictionary or a project's word list.

## How a package gets its upstream files

A package with an upstream source has a `sync` script that copies the files into `src/`, usually `src/hunspell/`. Never
edit those files by hand: the next sync overwrites them.

- **From an npm package** (most packages with a `sync` script). The script copies from a dependency, such as
  `dictionary-de` for `de_DE`: `pnpm cpy "node_modules/dictionary-de/**" src/hunspell`. The version in `package.json` decides what is
  copied, so updating the dependency updates the source.
- **From a GitHub repository** (8 packages). The script runs `sync-github-files <owner>/<repo> [paths...]` with
  `--tag <ref>` or `--latest`, and records what it fetched in `.sync-github-files.json`. `--latest` and a branch such as
  `main` follow upstream; a tag or commit is pinned until someone changes the script. It needs a GitHub token: run
  `pnpm run sync:manual` where the package has it, or set `GITHUB_TOKEN` (`gh auth token` prints one).
- **Other scripts.** A few packages run their own script, such as `ar`'s `scripts/sync.sh`, or `npm`'s
  `update-dictionary`, which regenerates its package list.

## What runs automatically

- **Build Dictionaries** runs on every push to `main`. For 19 packages, the conditional build runs `sync` first. Any
  change is built and proposed in a "Build Dictionaries" PR.
- **Update Dictionaries** runs weekly. It runs every package's `update-dictionary` script (today only `npm` has one)
  and opens an "Update Dictionaries" PR.
- **Update Dependencies** and Dependabot update the npm packages that the `cpy`-based `sync` scripts copy from. The
  source changes in the next Build Dictionaries run after those updates merge.

## Updating by hand

Use this to move a pinned tag, or to update a package whose sync doesn't run automatically.

### 1. Check the upstream change

- What changed upstream: a release note, a changelog, or the commits since the current tag or version?
- Is the license still the same? Compare the upstream license file. If it changed, or is unclear, stop and ask the
  maintainers in an issue before going further.

### 2. Sync

In the package, change the tag or the dependency version if needed (for a dependency, run `pnpm install` after), then:

```sh
pnpm run sync
```

### 3. Build and test

```sh
pnpm run build
pnpm test
```

Checks:

- Only upstream files, the built files, and `checksum.txt` changed.
- The size of the change makes sense for the upstream change. A built file that changed completely usually means a
  format or encoding change upstream, and needs a closer look.
- `pnpm test` passes.
- Words this repo excludes (`excludeWordsFrom`) are still excluded.

### 4. Commit and open a PR

- Commit the synced files and the built output together.
- Use `fix(<package directory>): update <source> to <version>`. Use `fix!:` or `feat!:` if the update makes existing
  setups flag text they accepted before, such as a big removal of words. See
  [Commits and pull requests](../commits-and-pull-requests.md).
- In the PR, link the upstream release or diff, and say whether the license changed.
