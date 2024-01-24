# CSpell Finnish Dictionary

Finnish dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-fi-fi
cspell link add @cspell/dict-fi-fi
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-fi-fi
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-fi-fi
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-fi-fi/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

MIT

fi_FI.dic and fi_FI.aff are under GNU ([source](https://github.com/fluks/fi-FI-mozilla-spellchecker))

> Some packages may have other licenses included.

<!--- @@inject: ../../static/footer.md --->
