# 0017. A GitHub source follows its default branch

Status: Accepted

## Context

A source from GitHub ([0006](./0006-third-party-sources-are-defined-by-name.md)) is fetched by `sync-github-files`,
which syncs a branch, tag, or commit (`--tag`), or the latest release (`--latest`). The 9 repositories synced today:

- 5 have no releases; `LibreOffice/dictionaries` has only build tags.
- Where releases exist, they don't always track the words: `crate-ci/typos` releases a tool, and `jshttp/mime-db`'s
  `master` is months ahead of its last release.
- Pins go stale: `en-common-misspellings` is pinned at `v1.33.1` while `typos` is at `v1.50.3`.
- Most follow a branch.

Following a branch doesn't let changes in without review: every source has a local copy, and the Build Dictionaries
workflow syncs, rebuilds, and opens a PR with any change. So what matters is maintainer time (nothing to bump by hand)
and freshness (upstream fixes arrive on their own). Following the latest release was weighed and rejected because
releases often don't track the words; pinning the commit fetched at creation, because pins go stale.

## Decision

We will sync a new GitHub source from the repository's default branch. `--add-source-ref <name>=<ref>` pins a tag or
commit instead, for a repository whose branch can't be used.

## Consequences

- New GitHub sources stay current with no bumping; changes are reviewed in the weekly Update Dictionaries PR
  ([0023](./0023-sources-sync-weekly.md)).
- A repository that commits broken files to its default branch shows up as a failing or surprising Update
  Dictionaries PR, and then gets pinned.

<!-- cspell:ignore jshttp -->
