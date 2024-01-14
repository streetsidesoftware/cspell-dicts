# CSpell Hungarian Dictionary

Hungarian dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-hu-hu
cspell link add @cspell/dict-hu-hu
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-hu-hu
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-hu-hu
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-hu-hu/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

GPL-3.0

## Source

Source: [Wooorm's Hungarian Dictionary][wooorm-hu-dict] which is based on [Magyar Ispell][magyarispell].

Magyar Ispell is licensed under the GPL-3.0 license, see its [LICENSE][magyarispell-license] for details.

Wooorm's dictionaries is licensed under the MIT license, see its [LICENSE][wooorm-license] for details.

[magyarispell-license]: https://raw.githubusercontent.com/laszlonemeth/magyarispell/master/COPYING.GPL3
[magyarispell]: https://github.com/laszlonemeth/magyarispell
[wooorm-hu-dict]: https://github.com/wooorm/dictionaries/tree/main/dictionaries/hu
[wooorm-license]: https://github.com/wooorm/dictionaries/blob/main/license

> Some packages may have other licenses included.

<!--- @@inject: ../../static/footer.md --->
