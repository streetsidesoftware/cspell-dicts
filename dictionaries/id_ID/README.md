# CSpell Indonesia Dictionary

Indonesia dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-id
cspell link add @cspell/dict-id
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-id
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-id
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-id/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## Source
[Indonesia hunspell dictionary. Kamus Bahasa Indonesia untuk program hunspell.](https://github.com/shuLhan/hunspell-id)

## License

LGPL-3.0

> Some packages may have other licenses included.

<!--- @@inject: ../../static/footer.md --->
