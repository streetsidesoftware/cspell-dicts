# Cspell Norwegian Bokmål Dictionary

Norwegian Bokmål dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-nb-no
cspell link add @cspell/dict-nb-no
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-nb-no
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-nb-no
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-nb-no/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

GPL-3.0

> Some packages may have other licenses included.
