# Cspell Medical Terms Dictionary

Medical Terms dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g cspell-dict-medicalterms
cspell-dict-medicalterms-link
```

## Uninstall from cspell

```sh
cspell-dict-medicalterms-unlink
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["<path to node_modules>/cspell-dict-medicalterms/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## License

MIT

> See Also [Source](https://github.com/Glutanimate/wordlist-medicalterms-en)

<!--- cspell:ignore medicalterms -->
