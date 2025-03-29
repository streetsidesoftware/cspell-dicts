# CSpell Bengali Dictionary

Bengali dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-bn
cspell link add @cspell/dict-bn
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-bn
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-bn
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-bn/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## Source

[github.com/MinhasKamal/BengaliDictionary](https://github.com/MinhasKamal/BengaliDictionary)

## License

GPL-3

> Some packages may have other licenses included.

<!--- @@inject: ../../static/footer.md --->
