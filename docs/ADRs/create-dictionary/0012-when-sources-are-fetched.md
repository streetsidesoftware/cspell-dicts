# 0012. When sources are fetched: all at once at creation, then weekly

Status: Proposed

## Why

**Goals:** easy to create, and easy to maintain. Creating a dictionary either succeeds with every source or leaves
nothing behind, and one failing source never holds back another dictionary's update.

**Problem:** Fetching can fail, at creation and during the weekly sync, and today one failure stops every dictionary's
update.

## Decision

- **At creation, fetch every remote source before writing anything.** If one fails, creation stops, and the error names
  the source and the cause. For a missing token it says to run `gh auth login` or set `GITHUB_TOKEN`. For a file over
  the cap it gives the size and says to raise it with `--add-source-max-size <name>=<size>`; when prompting, the
  generator asks.
- **Afterwards, weekly.** A new dictionary's `update-dictionary` script runs `sync`, so Update Dictionaries syncs it
  every Sunday. Its `conditional-build` only builds. `pnpm run sync` works by hand at any time.
- **One failure doesn't hold back the rest.** Update Dictionaries runs the scripts with `--no-bail`, opens the PR with
  whatever synced, then marks the run failed, naming the dictionaries that failed. They catch up the next week.

## Consequences

- A failed creation leaves nothing to clean up, and a rerun after fixing the cause just works.
- Anyone logged in to the GitHub CLI needs nothing more for the token, and the `sync:manual` scripts are legacy.
- Upstream changes arrive together in one weekly PR, and a fix takes up to a week unless someone syncs by hand.
- Moving existing dictionaries to `sources.yaml` and the weekly schedule is out of scope, tracked in #5836.

## Context

Fetching can fail: the network is down, the package or repository doesn't exist, a named file isn't there, a file is
over the size cap ([0011](./0011-how-the-sync-handles-change.md)), or there's no GitHub token. `sync-github-files` finds
a token from `--token`, then the `GITHUB_TOKEN` environment variable, then `gh auth token`, and stops without one. CI
always has `GITHUB_TOKEN`. Some dictionaries have `sync:manual` scripts that pass `gh auth token` by hand.

Syncing isn't consistent today. Build Dictionaries runs on every push to `main`, and for the 19 dictionaries whose
`conditional-build` starts with `sync`, it syncs, rebuilds, and opens a PR with any change. 7 dictionaries sync only by
hand. Update Dictionaries runs every Sunday, running each dictionary's `update-dictionary` script; only `npm` has one.
Any failure in that run stops it before its PR step, so nothing is updated that week.

## Rejected approaches

- At creation: skipping a source that failed, with a warning that's easy to miss, and letting a later sync fill it in;
  GitHub's public API without a token, limited to 60 requests an hour, which fails confusingly on larger repositories.
- Syncing on every push to `main`, or both weekly and on every push: upstream changes arrive at random, mixed with
  unrelated work.
- On a weekly failure: stopping every dictionary's update, as today; or only warning, so outages go unnoticed.
