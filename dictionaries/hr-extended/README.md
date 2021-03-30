# Cspell hr-extended Dictionary

Hr-extended dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-hr-extended
cspell link add @cspell/dict-hr-extended
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-hr-extended
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-hr-extended
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-hr-extended/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## Resources

The Hunspell source for this dictionary can be found: https://github.com/krunose/hunspell-hr

## License

MIT

> Some packages may have other licenses included.
