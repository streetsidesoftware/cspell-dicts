# CSpell Git Configuration

Configuration for spell checking Git Commit messages.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-git
cspell link add @cspell/dict-git
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-git
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-git/cspell-ext.json"],
    // …
}
```

## Usage commit-msg

**`.git/hooks/commit-msg`**

```sh
#!/bin/sh

exec npx cspell --language-id commit-msg $1
```

## License

MIT

> Some packages may have other licenses included.
