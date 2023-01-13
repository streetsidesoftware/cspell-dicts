# CSpell Brazilian Portuguese Dictionary

Brazilian Portuguese dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-pt-br
cspell link add @cspell/dict-pt-br
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-pt-br
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-pt-br/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## License

[GPL-3.0-or-later](./LICENSE)

> Some packages may have other licenses included.
