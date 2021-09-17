# CSpell en_GB Dictionary with MIT License

British English dictionary for cspell.

This is a pre-built dictionary for use with cspell.

**Note:** this is a limited dictionary, it is an old word list. Use `@cspell/dict-en-gb` for a more extensive dictionary.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-en-gb-mit
cspell link add @cspell/dict-en-gb-mit
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-en-gb-mit
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-en-gb-mit/cspell-ext.json"],
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
