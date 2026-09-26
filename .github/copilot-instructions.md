# Copilot Instructions

See [`CLAUDE.md`](../CLAUDE.md) at the repository root for the commands, conventions, and layout.

## Notes for code review

- **Dictionary content is data.** Don't flag or fix spelling, capitalization, or unusual characters in:
  - word lists in `dictionaries/*/src/`, which hold words as written in their language or tool
  - `samples/` and `tests/`
  - `exclude-words.txt` and other files that list words to remove
  - `dictionaries/en-common-misspellings/`, whose words are misspellings on purpose
- **Generated files.** Don't suggest editing these by hand. Point to the source instead:
  - `dictionaries/*/dict/*` and `.trie` files: built from `src/` by the package's `pnpm run build`.
  - `checksum.txt`: written by the package build.
  - Upstream files such as `src/hunspell/`: written by the package's `sync` script.
  - `@@inject` sections in READMEs, `dictionaries/*/static/`, and `static/dictionary-packages.*`: written by
    `pnpm run build:readme`.
  - `CHANGELOG.md` files and `.release-please-manifest.json`: written by Release Please.
  - `release-please-config.json`: written by `scripts/gen-release-please-config.sh`.
- **Word changes.** A change to a word list in `src/` should come with the rebuilt `dict/` files in the same PR.
- **pnpm only.** Don't suggest `npm` or `yarn` commands. The `preinstall` script blocks them.
- **Comments.** Don't ask for comments that restate what the code does.
