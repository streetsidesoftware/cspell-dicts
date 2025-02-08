# CSpell Armenian Dictionary

Armenian dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-hy
cspell link add @cspell/dict-hy
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-hy
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-am
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-hy/cspell-ext.json"],
    // …
}
```

## Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## Source

[martakert/hyspell: Hunspell dictionary for Armenian language](https://github.com/martakert/hyspell)

## License

MIT

> Some packages may have other licenses included.

<!--
cspell:words hyspell martakert
-->

<!--- @@inject: ../../static/footer.md --->
