# Cspell Scientific Terms US Dictionary

Scientific Terms US dictionary for cspell.

The words for this dictionary came from [John Petrie’s LifeBlag](http://www.jpetrie.net/scientific-word-list-for-spell-checkersspelling-dictionaries/)

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g cspell-dict-scientific-terms-us
cspell-dict-scientific-terms-us-link
```

## Uninstall from cspell

```sh
cspell-dict-scientific-terms-us-unlink
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["<path to node_modules>/cspell-dict-scientific-terms-us/cspell-ext.json"],
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

> Some packages may have other licenses included.

[//]: # 'cspell:ignore Petrie’s'
