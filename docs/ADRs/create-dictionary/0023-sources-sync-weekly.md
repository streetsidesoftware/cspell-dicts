# 0023. Sources are synced weekly, in Update Dictionaries

Status: Accepted

## Context

Syncing isn't consistent today:

- **Build Dictionaries** runs on every push to `main`. For the 19 dictionaries whose `conditional-build` starts with
  `sync`, it syncs, rebuilds, and opens a "Build Dictionaries" PR with any change.
- **7 dictionaries** have a `sync` that only runs when someone runs it by hand.
- **Update Dictionaries** runs every Sunday and runs each dictionary's `update-dictionary` script. Only `npm` has one.

Options weighed: sync on every push to `main`, which brings upstream changes at unpredictable times, mixed with
whatever else was pushed; or both weekly and on every push.

## Decision

We will sync sources weekly. A new dictionary's `update-dictionary` script runs `sync`, so Update Dictionaries syncs it
every Sunday, and its `conditional-build` only builds. `pnpm run sync` still works by hand at any time.

## Consequences

- Every dictionary with remote sources is synced the same way, and upstream changes arrive together in one weekly PR.
- A push to `main` no longer pulls in upstream changes as a side effect.
- An upstream fix takes up to a week to arrive, unless someone syncs by hand.
- Moving the existing dictionaries to this schedule is out of scope here.
