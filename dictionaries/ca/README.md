# CSpell Catalan Dictionary

Catalan dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-ca
cspell link add @cspell/dict-ca
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-ca
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-ca/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Resources

The resources for this dictionary can be obtained from the [LibreOffice repository](https://cgit.freedesktop.org/libreoffice/dictionaries/)

## License

MIT

> Some packages may have other licenses included.

GPLv2

> The catalan hunspell dictionary files are licensed under the GPLv2 license.

## Acknowledgement

- Contributed by [Jordi Olivares Provencio](https://github.com/jordiolivares)

<!---
    cspell:words Jordi Olivares Provencio
--->
