# CSpell Esperanto Dictionary

Esperanto dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-eo
cspell link add @cspell/dict-eo
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-eo
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-eo/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## License

GPL-2.0-or-later

> Some packages may have other licenses included.
