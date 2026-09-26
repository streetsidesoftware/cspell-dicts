# Contributing

Thanks for considering a contribution to cspell-dicts. You can help by:

- fixing or adding words in a dictionary
- creating a new dictionary
- filing issues about using the dictionaries
- helping answer issues

## TL;DR

- **Set up:** `pnpm install`, then `pnpm run prepare:dictionaries`. pnpm only: npm and yarn are blocked.
- **Words:** edit the word lists in `dictionaries/<name>/src/`, never the built files in `dict/`. Then sort, build the
  package, and commit both. See [Adding, removing, or fixing words](./docs/guides/word-changes.md).
- **A new dictionary:** run `pnpm run create-dictionary`. See [Creating a dictionary](./docs/guides/new-dictionary.md).
- **Before a PR:** `pnpm run lint` (fixes what it can) and `pnpm test` in the packages you changed.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/). Adding or removing words is `fix:`, a new
  dictionary is `feat:`, and a scope names the package directory: `fix(companies): add Sourcegraph`. See
  [Commits and pull requests](./docs/commits-and-pull-requests.md).
- **PR descriptions:** short, with a `## Summary` that stands on its own.

## More docs

- [Adding, removing, or fixing words](./docs/guides/word-changes.md), including the word format
- [Creating a dictionary](./docs/guides/new-dictionary.md)
- [Upstream updates](./docs/guides/upstream-updates.md)
- [Build and packaging](./docs/build-and-packaging.md), including the files that are generated
- [Commits and pull requests](./docs/commits-and-pull-requests.md)
- [Releasing](./docs/releasing.md)
- [Style](./docs/style.md)
- [Glossary](./docs/glossary.md)
- [ADRs](./docs/ADRs/README.md)
