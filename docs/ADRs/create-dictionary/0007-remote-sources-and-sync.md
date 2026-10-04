# 0007. Remote sources are recorded in `sources.yaml` and synced weekly

Status: Accepted

## Context

Every source has a local copy in `src/` ([0002](./0002-third-party-sources.md)). A source that lives upstream needs a
way to keep that copy current, and a record that tools can read.

**Where upstreams live.** About 30 Hunspell dictionaries have no `sync` script. Their READMEs point to GitHub or GitLab
(`az_AZ`, `fi_FI`, `sk_SK`, `tr_TR`, `gl_ES`), a website or download page (`be_BY`, `fr_FR`, `he`, `hy`, `pt_PT`,
`en_US`), other hosts (`ca`, `lt_LT`, `sl_SI`, and `nb_NO`, whose host has shut down), or nowhere usable (`bg_BG`, `eo`,
`la`, `vi_VN`). Download pages are mostly among older dictionaries; most living upstreams are on GitHub.

**How syncs work today.** Each source is a script in the dictionary's `package.json`. `th_th`, for example:

```json
"sync": "pnpm sync:syafiqhadzir && pnpm sync:LibreOffice",
"sync:LibreOffice": "sync-github-files LibreOffice/dictionaries --filter \"th_TH/th_TH.*\" … --tag=master -o src/LibreOffice",
"sync:syafiqhadzir": "sync-github-files syafiqhadzir/hunspell-th --filter \"th_TH.*\" … --tag=experimental -o src/syafiqhadzir",
```

A script per source is very hard to maintain, and a command line isn't a record anything else can read.
`sync-github-files` syncs a branch, tag, or commit (`--tag`), or the latest release (`--latest`). It finds a GitHub
token from `--token`, then the `GITHUB_TOKEN` environment variable, then `gh auth token`, and stops without one. Most
npm-based syncs copy from a `dictionary-*` package added as a devDependency
(`pnpm cpy "node_modules/dictionary-de/**" src/hunspell`); those packages are published from one GitHub repository,
`wooorm/dictionaries`, and as devDependencies they make every install slower.

**Releases and pins.** Of the 9 GitHub repositories synced today, 5 have no releases, and `LibreOffice/dictionaries` has
only build tags. Where releases exist, they don't always track the words: `crate-ci/typos` releases a tool, and
`jshttp/mime-db`'s `master` is months ahead of its last release. Pins go stale: `en-common-misspellings` is pinned at
`v1.33.1` while `typos` is at `v1.50.3`.

**When syncs run.** Build Dictionaries runs on every push to `main`, and for the 19 dictionaries whose
`conditional-build` starts with `sync`, it syncs, rebuilds, and opens a PR with any change. 7 dictionaries sync only by
hand. Update Dictionaries runs every Sunday, running each dictionary's `update-dictionary` script; only `npm` has one.

Options weighed:

- **Kinds:** a `--define-source-url` that downloads and unpacks an archive (each site's differs: zip, oxt, tar), or a
  GitLab kind like GitHub's.
- **npm:** keep `dictionary-*` devDependencies, or always prefer the npm package as the release. For the CDN, unpkg
  was weighed against jsDelivr; unpkg has had outages, and supporting both means two APIs.
- **What to follow:** the latest release, which often doesn't track the words, or the commit or version fetched at
  creation, which goes stale.
- **Which files:** globs or whole folders in `files:`, as `th_th`'s `--filter "th_TH/th_TH.*"` and `de_DE`'s
  `dictionary-de/**` do today, so renamed and new upstream files arrive on their own. But the build names exact files,
  so a rename needs a person anyway, and a pattern can pull very large or unreviewed files into the repo through a bot PR
  that's merged on trust.
- **The record:** keep the scripts; or a structured field in `package.json`, which npm doesn't know, can't have
  comments, and a reader can't identify. For the file format, JSON can't hold the comment that says what the file is,
  and `json5` drops comments when it writes a file back.
- **The sync's state:** a state file at the dictionary's root, which keeps stale entries when a source's folder is
  deleted or renamed; or inside `sources.yaml`, so every sync rewrites a file people edit. Keeping no state and
  comparing the upstream's hashes with hashes of the local files was rejected: it depends on the upstream never
  changing how it calculates them.
- **Files gone upstream:** upstream files are renamed and removed as a normal part of their projects' lives, and the
  sync can't tell a rename from a removal. `sync-github-files` prints "Path not found" and carries on, so nobody finds
  out. Failing the sync instead would repeat the same error every week, and since one failing dictionary stops Update
  Dictionaries before its PR step, it would hold back every other dictionary. Deleting the local copy would drop words
  from the next build.
- **Failures at creation:** create the dictionary without a source that failed, with an easy-to-miss warning; or fall
  back to GitHub's public API without a token, limited to 60 requests an hour.
- **A failure during the weekly sync:** today any failure stops Update Dictionaries before its PR step, so nothing is
  updated that week; or the sync could treat every failure as a warning, so outages go unnoticed.
- **Schedule:** sync on every push to `main`, which brings upstream changes at unpredictable times, mixed with whatever
  else was pushed.

## Decision

We will:

- **Support two kinds of remote source.**
  - **GitHub** (`--define-source-github`), preferred whenever an upstream has a repository. For `dictionary-de`, that's
    `dictionaries/de/` in `wooorm/dictionaries`. It follows the repository's default branch; `--add-source-ref
<name>=<ref>` pins a tag or commit instead, for a repository whose branch can't be used.
  - **npm** (`--define-source-npm`), when there's no usable repository. It's read from jsDelivr, without adding a
    dependency or downloading a tarball: files from `https://cdn.jsdelivr.net/npm/<pkg>@<version>/<path>`, and the file
    list from `https://data.jsdelivr.com/v1/packages/npm/<pkg>@<version>`. It follows the latest published version; an
    optional `version` pins it.
  - A source from a download page or any other host is downloaded by hand and defined as a local source, with
    `--add-source-url` recording where it came from.
- **Record a dictionary's sources in `sources.yaml`,** written by the generator from the `--define-source*` and
  `--add-source-*` options, and listed in `files` so it's published. For example:

  ```yaml
  # The sources of this dictionary, read by `pnpm run sync`.
  # Each source is copied into src/<name>/. See src/README.md.
  sources:
    - name: aoo
      github: marcoagpinto/aoo-mozilla-en-dict
      files:
        - dicts/en_XX/en_XX.dic
        - dicts/en_XX/en_XX.aff
      license: LICENSE
      readme: README.md
      url: https://github.com/marcoagpinto/aoo-mozilla-en-dict
  ```

  `files:` lists exact paths, never globs or folders. The file has no schema, like the repo's other templates.

- **Sync with one generic command** in `scripts/`, next to `sync-github-files`. It reads `sources.yaml`, and for each
  source calls `sync-github-files` or reads from jsDelivr. It reports a clear error when the file is missing something
  it needs. The dictionary's `package.json` has one `sync` script that runs it.
- **Store the identifiers the upstream returns** in a state file in each source's folder, as `sync-github-files` does
  today with `.sync-github-files.json`: each GitHub file's blob SHA, and an npm source's version and each file's hash.
  They're opaque: the sync compares what the upstream gave last time with what it gives now, and never calculates them
  itself. A file is fetched when its identifier changed or the file is missing.
- **Keep a file that's gone upstream, and note it once.** When a file named in `sources.yaml`, or a whole source, is
  gone upstream, the sync keeps the local copy and marks it as gone in the source's state file, with the date it was
  first missed. That change appears once in the weekly PR, which is the notice; later syncs see the mark and stay quiet.
  The source's other files still sync. If the file comes back, the mark is cleared. A rename is handled by updating
  `sources.yaml`.
- **Fetch every remote source before writing anything** at creation. If one fails, creation stops, and the error names
  the source and what failed: unreachable, not found, a missing file, or no token. For a missing token it says how to
  get one: `gh auth login`, or set `GITHUB_TOKEN`. The token is found the way `sync-github-files` finds it.
- **Sync weekly.** A new dictionary's `update-dictionary` script runs `sync`, so Update Dictionaries syncs it every
  Sunday, and its `conditional-build` only builds. `pnpm run sync` still works by hand at any time.
- **One dictionary's failure doesn't hold back the others.** Update Dictionaries runs the scripts with `--no-bail`,
  opens the PR with whatever synced, and then marks the run as failed, naming the dictionaries that failed. A failed
  dictionary catches up the next week.

## Consequences

- Adding or changing a source is an edit to `sources.yaml`, not a new script, and the generator, the sync, and the
  READMEs ([0008](./0008-sources-are-explained-in-the-readmes.md)) all read the same record.
- YAML adds no dependency: the generator writes the file from a template, as it already does
  `cspell-tools.config.yaml`, and `scripts/` already has `yaml`, whose `parseDocument` keeps comments if a file is
  rewritten.
- New dictionaries add no upstream devDependencies, so installs stay fast.
- New sources stay current with no bumping, and upstream changes arrive together in one weekly Update Dictionaries PR.
  A repository that commits broken files to its default branch shows up as a failing or surprising PR, and then gets
  pinned. An upstream fix takes up to a week to arrive, unless someone syncs by hand.
- A source's state lives and dies with its folder: deleting the folder makes the next sync fetch everything. The stored
  identifiers also give the README's Sources section a label for what was fetched.
- A source whose files go away upstream never breaks the dictionary or the weekly PR, and is reported once, not every
  week. A frozen file stays until a maintainer updates or removes it in `sources.yaml`.
- `sync-github-files` skips a file whose SHA matches without checking that it exists, so a deleted file isn't restored
  today. That gets fixed.
- A failed creation leaves no half-created dictionary to clean up. Anyone logged in to the GitHub CLI needs to do
  nothing for the token, and the `sync:manual` scripts that pass `gh auth token` by hand are legacy.
- A source from a download page or another host is updated by hand. A download or GitLab kind can be added later.
- Moving existing dictionaries to `sources.yaml`, off their `dictionary-*` devDependencies, and onto the weekly
  schedule is out of scope here.

<!-- cspell:ignore syafiqhadzir marcoagpinto jshttp wooorm -->
