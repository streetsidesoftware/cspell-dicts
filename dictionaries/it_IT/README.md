# CSpell Italian Dictionary

Italian dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-it-it
cspell link add @cspell/dict-it-it
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-it-it
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-it-it/cspell-ext.json"],
    // …
}
```

## License

GPL-3.0 or later

> Some packages may have other licenses included.
