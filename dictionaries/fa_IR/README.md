# Cspell Persian Dictionary

Persian dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-fa-ir
cspell link add @cspell/dict-fa-ir
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-fa-ir
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-fa-ir/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Resources

The Hunspell source for this dictionary can be found:

- https://github.com/b00f/lilak

## License

MIT

> Some packages may have other licenses included.
