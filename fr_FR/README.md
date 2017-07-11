# Cspell French Dictionary

French dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g cspell-dict-fr-fr
cspell-dict-fr-fr-link
```

## Uninstall from cspell

```sh
cspell-dict-fr-fr-unlink
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.
```json
{
    // …
    "import": ["<path to node_modules>/cspell-dict-fr-fr/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary.  Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Resources

The Hunspell source for this dictionary can be found:

* https://github.com/titoBouzout/Dictionaries

## License

MIT

See also: [French.txt](https://github.com/Jason3S/cspell-dicts/blob/master/fr_FR/French.txt)

