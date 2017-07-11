# Cspell nl_NL Dictionary

Dutch dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g cspell-dict-nl-nl
cspell-dict-nl-nl-link
```

## Uninstall from cspell

```sh
cspell-dict-nl-nl-unlink
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.
```json
{
    // …
    "import": ["<path to node_modules>/cspell-dict-nl-nl/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary.  Note: Building will take a few minutes for large files.

```sh
npm run build
```

## License

MIT
> Some packages may have other licenses included.
See: Dutch.txt

## Resources

The Hunspell source for this dictionary can be found:

* https://github.com/titoBouzout/Dictionaries
