# Word lists

<!--
audience: GitHub web contributor, technical contributor
kind: reference
level: none
-->

> [!NOTE]
> For anyone adding, removing, or fixing words: where they go, and how to write them.

The steps are in [Changing words in your browser](./guides/word-changes-in-browser.md) and
[Adding, removing, or fixing words](./guides/word-changes.md).

## Where words go

### The dictionary

- Words for a programming language or tool go in that dictionary, such as `dictionaries/python` or
  `dictionaries/git`.
- General software words go in `dictionaries/software-terms`.
- An English word valid in every English variant goes in `dictionaries/en_shared`, not in `en_US`, `en_GB`, or the
  others. A word for one variant goes in that variant's dictionary, such as `dictionaries/en_AU`.
- The English dictionaries are only for widely known words, that most English readers would understand. Jargon from one
  field goes in that field's dictionary, such as `gaming-terms`, even when that dictionary isn't enabled by default.
- Other general words go in the closest general dictionary, such as `companies` or `medicalterms`.

### The source file

Open the dictionary's `src/README.md`, and read the comment at the top of each source file in `src/`. They say what
belongs in each file. Most new words go in `src/additional_words.txt`, when the dictionary has one.

- Never edit files in `dict/`, or `.trie` files: they are built from `src/`.
- Never edit files synced from an upstream source, such as `src/hunspell/`.

### Removing a word

- If it is in a word list in `src/`, delete the line.
- If it comes from an upstream source, say so in the PR, and a maintainer will exclude it.

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
- **Order**: Most source lists are sorted for you, so add words anywhere. Within sections of other files, alphabetical
  order improves readability

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
