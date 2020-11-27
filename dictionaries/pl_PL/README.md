# Cspell Polish Dictionary

Polish dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-pl_pl
cspell link add @cspell/dict-pl-pl
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-pl-pl
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-pl_pl/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Resources

The Hunspell source for this dictionary can be found in several repositories:

- https://github.com/titoBouzout/Dictionaries
- https://github.com/wooorm/dictionaries/tree/master/dictionaries/pl_PL

## License

MIT

> Some packages may have other licenses included.
