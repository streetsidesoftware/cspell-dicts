# CSpell Shell Script Dictionary

Shell Script dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-shell
cspell link add @cspell/dict-shell
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-shell
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-shell/cspell-ext.json"],
    // …
}
```

## License

MIT

> Some packages may have other licenses included.
