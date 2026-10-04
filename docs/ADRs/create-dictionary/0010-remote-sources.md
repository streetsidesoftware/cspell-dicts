# 0010. Remote sources come from GitHub or npm, and follow their latest

Status: Accepted

## Why

Goal: easy to maintain. Upstreams live in many places, and today's syncs rely on devDependencies and on pins that go
stale.

## Decision

- **GitHub** (`--define-source-github`), whenever an upstream has a repository. A source is rooted at the folder that
  holds the dictionary: for `dictionary-de`, that's `wooorm/dictionaries/dictionaries/de`. It follows the default
  branch; `--add-source-ref <name>=<ref>` points it at another branch, a tag, or a commit, recorded as `ref`; "ref" is
  GitHub's word for any of them.
- **npm** (`--define-source-npm`), when there's no usable repository. Files are read from jsDelivr,
  `https://cdn.jsdelivr.net/npm/<pkg>@<version>/<path>`, and the file list from
  `https://data.jsdelivr.com/v1/packages/npm/<pkg>@<version>`, with no dependency and no tarball. It follows the latest
  published version; `version` pins it.
- **Anything else** is downloaded by hand and defined as a local source, with `--add-source-url` saying where it came
  from.

## Consequences

- New dictionaries add no upstream devDependencies.
- Sources stay current with no bumping. A repository that commits broken files shows up in the weekly PR, and then gets
  pinned.
- A source from a download page or another host is updated by hand. Other kinds can be added later.

## Context

- **Where upstreams live.** About 30 Hunspell dictionaries have no sync. Their READMEs point to GitHub or GitLab
  (`az_AZ`, `fi_FI`, `sk_SK`, `tr_TR`, and `gl_ES` on GitLab), a website or download page (`be_BY`, `fr_FR`, `he`,
  `hy`, `pt_PT`, `en_US`), other hosts (`ca`, `lt_LT`, `sl_SI`, and `nb_NO`, whose host has shut down), or nothing
  usable (`bg_BG`, `eo`, `la`, `vi_VN`). Download pages are mostly behind older dictionaries; most living upstreams are
  on GitHub.
- **npm today.** Most npm-based syncs copy a `dictionary-*` package added as a devDependency
  (`pnpm cpy "node_modules/dictionary-de/**" src/hunspell`). Those packages are published from one repository,
  `wooorm/dictionaries`, and as devDependencies they make pnpm slower and `node_modules` larger.
- **Releases and pins.** `sync-github-files` syncs a branch, tag, or commit (`--tag`), or the latest release
  (`--latest`). Of the 9 GitHub repositories synced today, 5 have no releases, and `LibreOffice/dictionaries` has only
  build tags. Where releases exist they don't always track the words: `crate-ci/typos` releases a tool, and
  `jshttp/mime-db`'s `master` is months ahead of its last release. Pins go stale: `en-common-misspellings` sat at
  `typos` `v1.33.1` while `typos` reached `v1.50.3`. Most follow a branch.
- **Review.** Following a branch doesn't let changes in without review: every source has a local copy, and changes
  arrive in a PR.

## Rejected approaches

- A kind that downloads and unpacks archives: each site's differs (zip, oxt, tar). A GitLab kind like GitHub's.
- `dictionary-*` devDependencies; always using the published npm package as the release, which doesn't always track
  the words either.
- unpkg instead of jsDelivr: unpkg has had outages, and supporting both means two APIs. jsDelivr has several CDN
  providers behind it, a documented API for listing a package's files, and 75 dictionary READMEs already use its URLs
  for install instructions (`scripts/lib/gen-dict-static-files.mts`).
- Following the latest release; pinning the commit or version fetched at creation, or a range such as `^3.0.0`. Pins
  and ranges need bumping by hand.

<!-- cspell:ignore jshttp wooorm -->
