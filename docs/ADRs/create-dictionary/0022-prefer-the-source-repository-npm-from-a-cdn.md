# 0022. Prefer the source repository; an npm source is read from a CDN

Status: Accepted

## Context

Most of today's npm-based syncs copy from a `dictionary-*` package (`dictionary-de`, `dictionary-nl`, …) added as a
devDependency: `pnpm cpy "node_modules/dictionary-de/**" src/hunspell`. Those packages are published from one GitHub
repository, `wooorm/dictionaries`.

Having dictionaries' upstreams as devDependencies isn't ideal: it makes pnpm slower, `node_modules` larger, and every
install take longer.

Options weighed: always use the published npm package, which is what upstream calls a release but, as with GitHub
releases ([0017](./0017-github-sources-follow-the-default-branch.md)), doesn't always track the words; or leave the
choice to the contributor.

## Decision

We will:

- **Sync from the source repository** when an upstream has one, as a GitHub source. For `dictionary-de`, that's
  `dictionaries/de/` in `wooorm/dictionaries`.
- **Read an npm source from an npm CDN** when there's no usable repository, without adding it as a dependency or
  downloading its tarball. `--define-source-npm` does this.

## Consequences

- New dictionaries add no upstream dependencies, so installs stay fast.
- Most upstreams sync one way ([0017](./0017-github-sources-follow-the-default-branch.md)).
- Moving existing dictionaries off their `dictionary-*` devDependencies is out of scope here.

<!-- cspell:ignore wooorm -->
