# 0018. A GitHub source needs a token when the dictionary is created

Status: Accepted

## Context

Fetching a GitHub source ([0017](./0017-github-sources-follow-the-default-branch.md)) uses `sync-github-files`, which
looks for a token in this order: `--token`, the `GITHUB_TOKEN` environment variable, then `gh auth token` from the
GitHub CLI. Without one it stops. CI always has `GITHUB_TOKEN`.

Options weighed:

- Fall back to GitHub's public API without a token. It's limited to 60 requests an hour, and walking a repository's
  tree can use many, so larger repositories would fail in confusing ways.
- Create the dictionary without fetching, and let the contributor run the sync later. The first build would have
  nothing from that source.

## Decision

We will use `sync-github-files`' token lookup as it is. Without a token, creating a dictionary with a GitHub source
stops before writing anything, with a message saying how to get one: `gh auth login`, or set `GITHUB_TOKEN`.

## Consequences

- Anyone logged in to the GitHub CLI needs to do nothing.
- A failed creation leaves no half-created dictionary to clean up.
- The `sync:manual` scripts that pass `gh auth token` by hand are redundant; they're legacy and can be removed.
