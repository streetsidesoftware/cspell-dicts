# CSpell Scala Dictionary

Scala dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-scala
cspell link add @cspell/dict-scala
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-scala
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-scala/cspell-ext.json"],
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

## Contributors

- [Arthur Peters](https://github.com/arthurp) contributed the word list: [Gist](https://gist.github.com/arthurp/20cd632ce0643a6ec3580276155bcc1c)
