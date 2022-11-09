# CSpell Gaming Dictionary

Gaming dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-gaming-terms
cspell link add @cspell/dict-gaming-terms
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-gaming-terms
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-gaming-terms
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-gaming-terms/cspell-ext.json"],
    // It is necessary to explicitly enable `gaming-terms` dictionary by including it in the
    // list of dictionaries.
    "dictionaries": ["gaming-terms"]
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

MIT

> Some packages may have other licenses included.
