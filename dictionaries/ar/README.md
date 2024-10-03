# CSpell Arabic Dictionary

Arabic dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-ar
cspell link add @cspell/dict-ar
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-ar
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-ar
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-ar/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## Source

[AyaSpell Arabic Dictionary for Hunspell Spellchecker](https://github.com/linuxscout/ayaspell)

## License

LGPL

> Some packages may have other licenses included.
