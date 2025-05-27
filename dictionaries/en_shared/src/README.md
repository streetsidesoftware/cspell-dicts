# Source Directory

All source files used to generate the English dictionaries should be stored in this directory.

## Remarks about `-ize` and `-ise` words

[!NOTE]
> `-ize` words are not specific to US English (`en_US`)
> US Americans chose to use them over `-ise` words.
>
> For this reason, most of the `-ise` words are not correct for US English

The truth is that `-ize` words originated in British English (`en_GB`).
The Oxford English dictionary prefers `-ize` over `-ise`.
Which is why the original British English dictionary (`en_GB`) included `-ize` variants.

The `en_GB-ise` dictionary is the British English dictionary without the `-ize` variants.

Canadian English (`en_CA`) & Australian English (`en_CA`) use both `-ise` and `-ize` forms.

## Adding words

If the words you want to add is valid for:

- For words in **all English variants** (`en_US`, `en_AU`, `en_CA`, `en_GB`, ...),
  add them to [shared-additional-words.txt](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/en_shared/src/shared-additional-words.txt)
- For American English (`en_US`) and Oxford English (`en_GB`) words ending in `ize`,
  add them to [shared-additional-words-ize.txt](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/en_shared/src/shared-additional-words-ize.txt)
- For non-American English variants (`en_AU`, `en_CA`, `en_GB-ise`, ...),
  add them to [shared-additional-words-ise.txt](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/en_shared/src/shared-additional-words-ise.txt)

## License

MIT

> Some packages may have other licenses included.

