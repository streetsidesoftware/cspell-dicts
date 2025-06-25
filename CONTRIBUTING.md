# Contributing

Please feel free to contribute to this project.

## How you can contribute

- Fixing spelling error in dictionaries.
- Creating new dictionaries.
- Filing any issues related to using dictionaries.
- Assisting in answering issues.

## Proposing Words

- If you have a word you believe belongs in a dictionary, send a pull request.
- For words associated with a particular programming language / environment, they should go in the appropriate dictionary under `dictionaries/<language>/src/<language>.txt`(s).
- It is okay to add multiple words in one Pull request, as long as they are related _(same dictionary or concept)_
- For general-purpose words, put them in the closest appropriate `dictionaries/<general-area>`(s).
- See the `README.md` files in those directories for more information.

<!-- cspell:locale en,en-GB,en-AU -->

## Word Formatting Guidelines

When adding words to dictionaries, please follow these formatting guidelines to maintain consistency:

### Capitalization

- **Proper nouns**: Capitalize names of specific people, places, organizations, and landmarks
  - Examples: `Melbourne`, `Sydney`, `Uluru`, `Great Barrier Reef`
- **Brand names and trademarked terms**: Use the official capitalization
  - Examples: `Vegemite`, `TimTam`, `Milo`, `ANZAC` (when referring to the biscuit)
- **Common nouns and general terms**: Use lowercase
  - Examples: `kangaroo`, `barbie`, `arvo`, `lamington`
- **Acronyms and initialisms**: Use standard capitalization
  - Examples: `NSW`, `AFL`, `CSIRO`

### Format

- **One entry per line**: Each word or phrase should be on its own line
- **Multi-word entries**: Preserve spaces in multi-word proper nouns
  - Example: `Great Barrier Reef` (not `GreatBarrierReef`)
- **Comments**: Use `#` for comments to explain context or usage
- **Sorting**: While not required, alphabetical sorting within sections improves readability

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

### Regional Variants

- **Region-specific words**: Add to the appropriate regional dictionary (e.g., `en_AU`, `en_GB`, `en_US`)
- **Shared words**: If a word is valid across multiple English variants, add it to `dictionaries/en_shared` instead
- **Spelling variants**: Use the spelling appropriate for the regional dictionary
  - For `en_AU` and `en_GB`: Use -ise endings (e.g., `organise`)
  - For `en_US`: Use -ize endings (e.g., `organize`)
  
<!-- 
  cspell:words Bondi brekkie CSIRO Uluru  
-->
