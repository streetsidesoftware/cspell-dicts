# Cspell Ukrainian Dictionary

Ukrainian dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g cspell-dict-uk-ua
cspell-dict-uk-ua-link
```

## Uninstall from cspell

```sh
cspell-dict-uk-ua-unlink
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["<path to node_modules>/cspell-dict-uk-ua/cspell-ext.json"],
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

- https://github.com/wooorm/dictionaries/tree/master/dictionaries/uk

## License

MIT

> Some packages may have other licenses included.
