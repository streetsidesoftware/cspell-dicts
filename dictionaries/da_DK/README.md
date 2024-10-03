# CSpell Danish Dictionary

Danish dictionary for CSpell.

This is a pre-built dictionary, base on [Stavekontrolden](https://www.stavekontrolden.dk), for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-da-dk
cspell link add @cspell/dict-da-dk
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-da-dk
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-da-dk/cspell-ext.json"],
    "language": "da-DK",
    // …
}
```

## Resources

The Hunspell source for this dictionary can be found:

- https://github.com/wooorm/dictionaries/tree/main#readme

<!--- cspell:ignore Stavekontrolden --->
