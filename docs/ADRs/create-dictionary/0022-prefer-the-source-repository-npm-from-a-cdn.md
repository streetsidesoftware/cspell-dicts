# 0022. Prefer the source repository; an npm source is read from jsDelivr

Status: Accepted

## Context

Most of today's npm-based syncs copy from a `dictionary-*` package (`dictionary-de`, `dictionary-nl`, …) added as a
devDependency: `pnpm cpy "node_modules/dictionary-de/**" src/hunspell`. Those packages are published from one GitHub
repository, `wooorm/dictionaries`.

Having dictionaries' upstreams as devDependencies isn't ideal: it makes pnpm slower, `node_modules` larger, and every
install take longer.

Options weighed: always use the published npm package, which is what upstream calls a release but, as with GitHub
releases ([0017](./0017-github-sources-follow-the-default-branch.md)), doesn't always track the words; or leave the
choice to the contributor. For the version, pinning the one fetched at creation, or writing a range such as `^3.0.0`,
were weighed; both need bumping by hand.

jsDelivr was chosen over unpkg: it has several CDN providers behind it, a documented API for listing a package's files,
and the repo already relies on it; the install instructions in 75 dictionary READMEs use its URLs
(`scripts/lib/gen-dict-static-files.mts`). unpkg has had outages, and supporting both means two APIs.

## Decision

We will:

- **Sync from the source repository** when an upstream has one, as a GitHub source. For `dictionary-de`, that's
  `dictionaries/de/` in `wooorm/dictionaries`.
- **Read an npm source from jsDelivr** when there's no usable repository, without adding it as a dependency or
  downloading its tarball: files from `https://cdn.jsdelivr.net/npm/<pkg>@<version>/<path>`, and the file list from
  `https://data.jsdelivr.com/v1/packages/npm/<pkg>@<version>`. `--define-source-npm` does this.
- **Sync an npm source's latest published version.** An optional `version` in `sources.yaml` pins it. The version
  fetched is recorded, so a sync with nothing new changes nothing. As for GitHub sources, changes are reviewed in a PR.

## Consequences

- New dictionaries add no upstream dependencies, so installs stay fast.
- Most upstreams sync one way ([0017](./0017-github-sources-follow-the-default-branch.md)).
- Moving existing dictionaries off their `dictionary-*` devDependencies is out of scope here.

<!-- cspell:ignore wooorm -->
