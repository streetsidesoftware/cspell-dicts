# CSpell Serbian (Latin) Dictionary

Serbian (Latin) dictionary for cspell.

This is a pre-built dictionary for use with CSpell. The word list is based on
Milutin Smiljanić's [korektor](https://github.com/msmiljan/korektor). The cspell
dictionary has been compiled and is maintained by [Toma Tasovac](https://github.com/ttasovac).

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-sr-latn
cspell link add @cspell/dict-sr-latn
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-sr-latn
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-sr-latn
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-sr-latn/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

GNU GPL

> Some packages may have other licenses included.
