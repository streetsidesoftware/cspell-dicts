---
name: upstream-update
description: 'Updates a cspell-dicts dictionary built from an upstream source, such as a Hunspell dictionary from an npm package like dictionary-de, a GitHub repository fetched by sync-github-files, or a dictionary''s own update script: checks the upstream change and its license, runs the sync script, rebuilds, reviews the diff, and drafts the commit message and PR description. Use when the user asks to update, refresh, re-sync, or bump a dictionary''s upstream source or tag, to review a "Build Dictionaries" or "Update Dictionaries" bot PR, or why a dictionary changed after a dependency update. For hand-edited word changes, use word-change. For switching a dictionary to a different source, use feature-adr.'
---

# upstream-update

Updates a dictionary from its upstream source, and reviews the change before it's committed: an update can change
thousands of words, and a new upstream license can change what the dictionary may be published under. Read
`docs/guides/upstream-updates.md` first: it explains the kinds of `sync` scripts and what runs automatically.

## Workflow

### 1. Identify the source

Know where the dictionary's upstream files come from, and whether anything already updates them.

- **Do:**
  - Read the dictionary's `package.json`: its `sync` and `sync:*` scripts, `update-dictionary` if any, and the
    dependency a script copies from.
  - Read `cspell-tools.config.yaml`: which targets read the synced files, and any `excludeWordsFrom`.
  - Name the kind of source: an npm package, a GitHub repository (pinned, or following a branch or `--latest`), or the
    dictionary's own script.
  - Check whether the Build Dictionaries workflow already syncs it: its `conditional-build` script runs `sync`.
- **Stop and ask** if a workflow already keeps it current: is a manual update still wanted?

### 2. Check the upstream change

Know what changed upstream, and whether its license still fits.

- **Do:** find what changed since the current version or tag: a release, a changelog, or a compare view.
- **Check:** the upstream license matches the one in the dictionary's synced files and its `LICENSE`.
- **Stop and ask** if the license changed, is missing, or is unclear. Give the exact source and version, the old and
  new license, and what the dictionary's license would have to become. Go no further until the user decides.

### 3. Sync and build

Bring in the upstream files and rebuild.

- **Do,** in the dictionary's directory:
  - If the update needs it, change the tag in the `sync` script, or the dependency's version and then run
    `pnpm install` at the repo root.
  - Run the sync, build, and tests:

    ```sh
    pnpm run sync
    pnpm run build
    pnpm test
    ```

- **If it fails:** a GitHub source needs a token. The sync uses `GITHUB_TOKEN`, or else `gh auth token` when the user
  is logged in to the GitHub CLI. **Stop and ask** if neither gives one.

### 4. Review the diff

Show the user how big the change is, and that nothing unexpected changed.

- **Check:**
  - Only the synced files, the built files, `checksum.txt`, and what you changed on purpose differ.
  - The words added and removed in the built output. For a plaintext target, use `git diff --stat` and `git diff` on
    `dict/`. For a trie, diff its plaintext copy if the dictionary builds one, as `en_US` does with `dict/en_US.txt`.
  - Excluded words (`excludeWordsFrom`) are still excluded.
  - Dictionaries that read this one's files still build and pass their tests, as in `docs/dictionary-packages.md`.
  - `pnpm run lint`, from the repo root, passes.
- **Do:** show the user the size of the change and a sample of the removed words.
- **Stop and ask:**
  - for a trie with no plaintext copy: how the user wants it checked.
  - if a built file changed completely. That usually means a format or encoding change upstream; investigate first.

### 5. Draft the commit message and PR description

Give the user drafts to approve.

- **Do:**
  - Type and scope as in `docs/commits-and-pull-requests.md`, usually `fix(<dictionary>): update <source> to
<version>`.
  - The description: a `## Summary`, the upstream release or diff link, the size of the change, and whether the
    license changed.
- **Stop and ask:**
  - when the type is a judgment call, such as a large removal of words.
  - before committing, pushing, or opening a PR.

## Not this skill

- A word from upstream is wrong. Exclude it with `excludeWordsFrom`, or report it upstream. Never edit synced files by
  hand.
- The dictionary should switch to a different upstream source. That's a design change: offer `feature-adr`.
