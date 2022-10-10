# Cspell Html Symbol Entities Dictionary

HTML Symbol Entities dictionary for cspell.

This is a pre-built dictionary for use with cspell.

This addon dictionary adds HTML symbol entities like: `&mdash;`, `&laquo;`, and `&gtrarr;` to the spell checker for `html` and `markdown` files.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-html-symbol-entities
cspell link add @cspell/dict-html-symbol-entities
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-html-symbol-entities
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-html-symbol-entities/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary.
_Note:_ Building will take a few minutes for large files.

```sh
npm run build
```

## License

MIT

> Some packages may have other licenses included.
