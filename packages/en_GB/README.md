# Cspell en_GB Dictionary

British English dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g cspell-dict-en-gb
cspell-dict-en-gb-link
```

## Uninstall from cspell

```sh
cspell-dict-en-gb-unlink
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["<path to node>/cspell-dict-en-gb/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Adding Words

Please add any words to [src/additional_words.txt](./src/additional_words.txt) by making a pull request.

## License

MIT

> Some packages may have other licenses included.
