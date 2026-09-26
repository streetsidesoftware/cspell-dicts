# Adding, removing, or fixing words

How to change the words in an existing dictionary. To add a whole new dictionary, see
[Creating a dictionary](./new-dictionary.md). To update words that come from an upstream source, see
[Upstream updates](./upstream-updates.md).

It is fine to change several words in one PR, as long as they are related: the same dictionary, or the same concept.

## 1. Set up

```sh
pnpm install
pnpm run prepare:dictionaries
```

## 2. Find the dictionary

- Words for a programming language or tool go in that dictionary, such as `dictionaries/python` or
  `dictionaries/git`.
- General software words go in `dictionaries/software-terms`. Its `src/` has one file per kind of term, such as
  `coding-terms.txt` and `software-tools.txt`.
- An English word valid in every English variant goes in `dictionaries/en_shared`, not in `en_US`, `en_GB`, or the
  others. A word for one variant goes in that variant's dictionary, such as `dictionaries/en_AU`.
- Other general words go in the closest general dictionary, such as `companies` or `medicalterms`.

To see which dictionaries already have a word, run this from the repo root:

```sh
pnpm exec cspell trace --only-found <word>
```

The package's `README.md` and `src/README.md`, if it has one, may say more about where words go.

## 3. Find the source file

Open the package's `cspell-tools.config.yaml`. Each target lists the source files it is built from. Add words to a file
in `src/` that the right target reads.

- Never edit files in `dict/`, or `.trie` files: they are built from `src/`.
- Never edit files fetched from upstream, such as `src/hunspell/`. See [Upstream updates](./upstream-updates.md).

## 4. Edit the words

Follow the [format](#format) below.

To remove a word:

- If it is in a word list in `src/`, delete the line.
- If it comes from an upstream source, add it to the file the target's `excludeWordsFrom` names, such as
  `src/exclude-words.txt`. If the target has none, say so in the PR and ask how to exclude it.

## 5. Sort, build, and test

From the repo root:

```sh
pnpm run sort
```

Then in the package:

```sh
pnpm run build
pnpm test
```

Checks:

- `dict/` (or the `.trie` file) changed the way you expected, and nothing else did.
- `pnpm test` passes.
- If other packages read this package's files (see
  [Sources from other packages](../build-and-packaging.md#sources-from-other-packages)), build and test them too. For
  example, after changing `en_shared`, build the English dictionaries.

## 6. Commit and open a PR

- Commit the `src/` change and the rebuilt `dict/` output together.
- Use `fix:` with the package's directory as scope, such as `fix(companies): add Sourcegraph`. A new domain of words is
  `feat:`. See [Commits and pull requests](../commits-and-pull-requests.md).
- In the PR, say which words changed and why, with a source for words that aren't obvious.

## Format

<!-- cspell:locale en,en-GB,en-AU -->

### Capitalization

- **Proper nouns**: Capitalize names of specific people, places, organizations, and landmarks
  - Examples: `Melbourne`, `Sydney`, `Uluru`, `Great Barrier Reef`
- **Brand names and trademarked terms**: Use the official capitalization
  - Examples: `Vegemite`, `TimTam`, `Milo`, `ANZAC` (when referring to the biscuit)
- **Common nouns and general terms**: Use lowercase
  - Examples: `kangaroo`, `carrot`, `placement`
- **Acronyms and initialisms**: Use standard capitalization
  - Examples: `NSW`, `AFL`, `CSIRO`

### Lines

- **One entry per line**: Each word or phrase should be on its own line
- **Multi-word entries**: Preserve spaces in multi-word proper nouns
  - Example: `Great Barrier Reef` (not `GreatBarrierReef`)
- **Comments**: Use `#` for comments to explain context or usage
- **Sorting**: `pnpm run sort` sorts the source files listed in `sort-source.config.json`. For other files, alphabetical
  sorting within sections improves readability

### Examples

```
# Australian cities (proper nouns - capitalized)
Brisbane
Melbourne
Sydney

# Australian slang (common nouns - lowercase)
arvo
barbie
brekkie

# Brand names (use official capitalization)
Vegemite
TimTam

# Multi-word places
Great Barrier Reef
Bondi Beach
```

### Regional variants

- **Region-specific words**: Add to the appropriate regional dictionary (e.g., `en_AU`, `en_GB`, `en_US`)
- **Shared words**: If a word is valid across multiple English variants, add it to `dictionaries/en_shared` instead
- **Spelling variants**: Use the spelling appropriate for the regional dictionary
  - For `en_AU` and `en_GB`: Use -ise endings (e.g., `organise`)
  - For `en_US`: Use -ize endings (e.g., `organize`)

<!--
  cspell:words Bondi brekkie CSIRO Uluru
-->
