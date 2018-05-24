# Cspell Danish Dictionary

Danish dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g cspell-dict-da-dk
cspell-dict-da-dk-link
```

## Uninstall from cspell

```sh
cspell-dict-da-dk-unlink
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["<path to node_modules>/cspell-dict-da-dk/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary.  Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Contributors

* [Viktor Hundahl Strate](https://github.com/viktorstrate)

## License

MIT
> Some packages may have other licenses included.
