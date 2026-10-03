# Adding, removing, or fixing words

<!--
audience: GitHub web contributor, technical contributor
kind: guide
level: none to edit in the browser; basic git and a terminal to work in a clone. No coding.
-->

> [!NOTE]
> For anyone changing words in a dictionary, in the browser on GitHub or in a clone. No coding needed.

How to change the words in an existing dictionary. To add a whole new dictionary, see
[Creating a dictionary](./new-dictionary.md). To update words that come from an upstream source, see
[Upstream updates](./upstream-updates.md).

It is fine to change several words in one PR, as long as they are related: the same dictionary, or the same concept.

> [!TIP]
> **Using an AI agent?** Copy this into a new session and fill in the brackets:
>
> ```text
> Change words in a cspell-dicts dictionary, following docs/guides/word-changes.md.
>
> Add: [words, one per line]
> Remove: [words, or "none"]
> Why: [where these words are used, with a link if you have one]
>
> Pick the dictionary as the guide says. To pick the source file, read the dictionary's src/README.md and the header
> comments at the top of its source files. Most new words go in src/additional_words.txt.
> Then sort, build, and test the dictionary, and open a PR that lists each word and why.
> ```

## 1. Find the dictionary

- Words for a programming language or tool go in that dictionary, such as `dictionaries/python` or
  `dictionaries/git`.
- General software words go in `dictionaries/software-terms`.
- An English word valid in every English variant goes in `dictionaries/en_shared`, not in `en_US`, `en_GB`, or the
  others. A word for one variant goes in that variant's dictionary, such as `dictionaries/en_AU`.
- The English dictionaries are only for widely known words, that most English readers would understand. Jargon from one
  field goes in that field's dictionary, such as `gaming-terms`, even when that dictionary isn't turned on by default.
- Other general words go in the closest general dictionary, such as `companies` or `medicalterms`.

To see whether a dictionary already has a word, search the repo on GitHub, such as
`repo:streetsidesoftware/cspell-dicts path:dictionaries/ Sourcegraph`. In a clone,
`pnpm exec cspell trace --only-found <word>` lists the dictionaries that have it.

## 2. Find the source file

Open the dictionary's `src/README.md`, and read the comment at the top of each source file in `src/`. They say what
belongs in each file. Most new words go in `src/additional_words.txt`, when the dictionary has one.

- Never edit files in `dict/`, or `.trie` files: they are built from `src/`.
- Never edit files synced from an upstream source, such as `src/hunspell/`. See
  [Upstream updates](./upstream-updates.md).

## 3. Edit the words

Follow the [format](#format) below. The order doesn't matter: the source lists are sorted for you.

To remove a word:

- If it is in a word list in `src/`, delete the line.
- If it comes from an upstream source, say so in the PR, and a maintainer will exclude it.

## 4. Open a PR

Use `fix:` with the dictionary's directory as the scope, such as `fix(companies): add Sourcegraph`, for the PR title.
In the PR, say which words changed and why, with a source for words that aren't obvious. See
[Commits and pull requests](../commits-and-pull-requests.md).

### In your browser

1. Open the source file on GitHub, and select **Edit** (the pencil). If you can't write to the repo, GitHub offers to
   fork it.
2. Make the change, then select **Commit changes** and **Propose changes**.
3. Open the PR.

After you open the PR, autofix.ci sorts the word lists and commits the result. Leave `dict/` alone: the
[Build Dictionaries](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/build-dictionaries.yml)
workflow rebuilds it after your PR is merged.

### In a clone

Check the [prerequisites](../repository.md#prerequisites). Then, from the repo root:

```sh
pnpm install
pnpm run prepare:dictionaries
pnpm run sort
```

Then in the dictionary's directory:

```sh
pnpm run build
pnpm test
```

Checks:

- `dict/` (or the `.trie` file) changed the way you expected, and nothing else did.
- `pnpm test` passes.
- If other dictionaries read this dictionary's files (see
  [Using another package's files](../dictionary-packages.md#using-another-packages-files)), build and test them too.
  For example, after changing `en_shared`, build the English dictionaries.

Commit the `src/` change and the rebuilt `dict/` together, and open the PR.

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
