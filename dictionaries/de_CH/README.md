# CSpell Swiss German Dictionary

Swiss German dictionary for CSpell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-de-ch
cspell link add @cspell/dict-de-ch
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-de-ch
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-de-ch/cspell-ext.json"],
    // …
}
```

## Resources

The Hunspell source for this dictionary can be found:

- https://github.com/wooorm/dictionaries/tree/main#readme
