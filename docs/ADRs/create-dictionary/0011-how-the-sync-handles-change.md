# 0011. How the sync handles upstream change

## Why

**Goal:** easy to maintain. The weekly sync brings upstream changes in on its own, and reports anything a maintainer
must act on, once.

**Problem:** Upstream files change, move, and disappear. Today the sync misses that silently, and failing instead would
break the weekly update for every dictionary.

## Decision

- **One sync command,** `sync-sources`, in `scripts/` next to `sync-github-files`, reads `src/sources.yaml` and syncs
  each source. A dictionary's `package.json` has one `sync` script that runs it.
- **Stored identifiers.** A state file in each source's folder holds what the upstream returned:
  `.sync-github-files.json` with each GitHub file's blob SHA, or `.sync-npm-files.json` with an npm source's version and
  each file's hash. Both handle a file whose local path differs from its upstream path ([0003](./0003-sources-file.md)),
  so each entry ties the upstream path and its identifier to the local file. They're opaque; the sync compares what the
  upstream gave last time with what it gives now, and never calculates them. A file is fetched when its identifier
  changed or it's missing locally.
- **Gone upstream.** When a named file or a whole source is gone, the sync keeps the local copy and marks it gone in the
  state file, with the date it was first missed. That change shows once in the weekly PR; later syncs stay quiet. If it
  comes back, the mark is cleared. The source's other files still sync.
- **Size cap.** A file over 30 MB keeps its old copy and is noted once, the same way. `max-size` on a source in
  `src/sources.yaml` raises the cap. A size is a number with a binary unit, as GitHub uses: `40MB` or `500KB`, where 1
  MB is 1,048,576 bytes. A number with no unit is an error, so `40` is never read as bytes.

## Consequences

- A source's state lives and dies with its folder: deleting the folder makes the next sync fetch everything.
- The stored identifiers label what was fetched, for the README's Sources section.
- A file going away upstream never breaks the dictionary or the weekly PR. It stays frozen until a maintainer updates
  `sources.yaml`.
- `sync-github-files` gains the existence check, the gone marks, the cap, and files whose local path differs.

## Context

`sync-github-files` keeps a `.sync-github-files.json` in each folder it syncs, holding each file's blob SHA, and skips a
file whose SHA hasn't changed (11 committed today). It doesn't check that the skipped file exists, so a deleted local
file is never restored. A path that's gone upstream prints "Path not found" and the sync carries on without an error, so
nobody finds out.

Upstream files are renamed and removed as a normal part of a project's life, and the sync can't tell a rename from a
removal. One failing dictionary stops Update Dictionaries before its PR step, holding back every other dictionary. The
largest committed source files are about 20 MB (`hy`'s `hy-AM.dic` is 21.1 MB); GitHub warns at 50 MB and rejects
files over 100 MB.

## Rejected approaches

- State at the dictionary's root: keeps stale entries when a folder is deleted or renamed. State in `sources.yaml`:
  every sync rewrites a file people edit, and the SHAs bury the definitions.
- No state, comparing the upstream's hashes with hashes of the local files: depends on the upstream never changing how
  it calculates them.
- Failing the sync when a file is gone: the same error every week, holding back every other dictionary. Only a
  warning in the log: nobody reads it. Deleting the local copy: the next build loses words.
- A growth check on file size, such as more than double the last size; no size limit, relying on the PR's diff stats.
