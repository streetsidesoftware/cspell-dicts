# CSpell Austrian German Dictionary

Austrian German dictionary for CSpell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-de-at
cspell link add @cspell/dict-de-at
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-de-at
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-de-at/cspell-ext.json"],
    // …
}
```

## Resources

The Hunspell source for this dictionary can be found:

- https://github.com/wooorm/dictionaries/tree/main#readme
