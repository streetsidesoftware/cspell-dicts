---
name: upstream-update
description: 'Update a cspell-dicts dictionary that is built from an upstream source (a Hunspell dictionary from an npm package such as dictionary-de, a GitHub repository fetched by sync-github-files, or a package''s own update script): check the upstream change and its license, run the package''s sync script, rebuild, review the diff, and draft the commit message and PR description. Use this whenever the user asks to update, refresh, re-sync, or bump a dictionary''s upstream source or tag, to review a "Build Dictionaries" or "Update Dictionaries" bot PR, or asks why a dictionary changed after a dependency update. Do not use it for hand-edited word changes (use word-change) or for switching a dictionary to a different source (use feature-adr).'
---

# upstream-update

Updates a dictionary from its upstream source by following `docs/guides/upstream-updates.md`. Read that guide first:
it explains the kinds of `sync` scripts and what runs automatically. This skill adds the checks and the drafts.

An upstream update can change thousands of words at once, and a new upstream license can change what the package may
be published under. So the review comes before the commit.

## Workflow

### 1. Identify the package and the kind of source

- Read the package's `package.json`: its `sync` script (and `sync:*` scripts), `update-dictionary` if any, and the
  dependency the script copies from.
- Read `cspell-tools.config.yaml`: which targets read the synced files, and any `excludeWordsFrom`.
- Say which kind it is: npm package, GitHub repository (pinned or following a branch or `--latest`), or its own
  script. Check whether the Build Dictionaries workflow already syncs it (its `conditional-build` script runs `sync`).

If the automatic workflows already keep it current, tell the user, and ask whether a manual update is still wanted.

### 2. Check the upstream change

- Find what changed upstream since the current version or tag: a release, a changelog, or a compare view.
- Compare the upstream license with the one in the package's synced files and its `LICENSE`. If it changed, is missing,
  or is unclear, stop and tell the user: the exact source and version, the old and new license, and what the package's
  license would have to become. Don't go further until they decide.

### 3. Sync and build

In the package:

- Change the tag in the `sync` script, or the dependency version (then `pnpm install` at the root), if the update
  needs it.
- Run the sync. For a GitHub source it needs a token: `pnpm run sync:manual` if the package has it, or
  `GITHUB_TOKEN=$(gh auth token) pnpm run sync`. Ask the user if no token is available.

```sh
pnpm run build
pnpm test
```

### 4. Review the diff

- Only the synced files, built files, `checksum.txt`, and anything you changed on purpose should differ.
- Measure the change in the built output: words added and removed. For a plaintext target, use `git diff --stat` and
  `git diff` on `dict/`. For a trie, diff the plaintext copy if the package builds one (as `en_US` does with
  `dict/en_US.txt`); otherwise ask the user how they want it checked. Show the user the size and a sample of removed
  words.
- A built file that changed completely usually means a format or encoding change upstream. Investigate before going
  on.
- Excluded words (`excludeWordsFrom`) must still be excluded.
- Build and test packages that read this package's files, as in `docs/build-and-packaging.md`.
- Run `pnpm run lint` from the repo root.

### 5. Draft the commit message and PR description

- **Type and scope:** see `docs/commits-and-pull-requests.md`. An upstream update is usually
  `fix(<package>): update <source> to <version>`. Ask the user when the type is a judgment call, such as a large
  removal of words.
- **Description:** a `## Summary`, the upstream release or diff link, the size of the change, and whether the license
  changed.

Show the drafts to the user. Don't commit, push, or open a PR until they say so.

## Notes

- Never edit synced files by hand, to fix a word or anything else. Exclude it with `excludeWordsFrom`, or report it
  upstream.
- Switching a package to a different upstream source is a design change. Offer `feature-adr`.
