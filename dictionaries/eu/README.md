# CSpell Basque Dictionary

Basque dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-eu
cspell link add @cspell/dict-eu
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-eu
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-eu
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-eu/cspell-ext.json"],
    // …
}
```

## References

- Source: [jmigartua/basque_hunspell](https://github.com/jmigartua/basque_hunspell)

## License

MIT

> Some packages may have other licenses included.

<!--- cspell:ignore jmigartua --->
