# 0018. Remote sources are fetched first, and any failure stops creation

Status: Accepted

## Context

Creating a dictionary with remote sources ([0017](./0017-github-sources-follow-the-default-branch.md)) needs the
network, and can fail: the network is down, the npm package or repository doesn't exist, a named file isn't in it, or
there's no GitHub token.

`sync-github-files` looks for a token in this order: `--token`, the `GITHUB_TOKEN` environment variable, then
`gh auth token` from the GitHub CLI. Without one it stops. CI always has `GITHUB_TOKEN`.

Options weighed:

- Create the dictionary without a source that failed, with a warning, and let a later sync fill it in. The first build
  would be missing a source, and the warning is easy to miss.
- Fall back to GitHub's public API without a token. It's limited to 60 requests an hour, and walking a repository's
  tree can use many, so larger repositories would fail in confusing ways.

## Decision

We will fetch every remote source before writing anything. If one fails, creation stops, and the error names the source
and what failed: unreachable, not found, a missing file, or no token. For a missing token, it says how to get one:
`gh auth login`, or set `GITHUB_TOKEN`. The token is found the way `sync-github-files` finds it.

## Consequences

- A failed creation leaves no half-created dictionary to clean up, and a rerun after fixing the cause just works.
- Anyone logged in to the GitHub CLI needs to do nothing for the token.
- The `sync:manual` scripts that pass `gh auth token` by hand are redundant; they're legacy and can be removed.
