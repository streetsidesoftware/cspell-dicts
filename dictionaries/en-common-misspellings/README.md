# CSpell Common English Misspellings Dictionary

Common English Misspellings dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

## Requirements

| Tool                                                                                                                                 | Version      |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6.25.0 ` |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2.17.0`  |

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-en-common-misspellings
cspell link add @cspell/dict-en-common-misspellings
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-en-common-misspellings
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-en-common-misspellings
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-en-common-misspellings/cspell-ext.json"],
    // …
}
```

## Reference

The source of this dictionary comes from:

- [Wikipedia:Lists of common misspellings/For machines - Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Lists_of_common_misspellings/For_machines)
- [Wikipedia:Lists of common misspellings - Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Lists_of_common_misspellings)

## Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

MIT

> Some packages may have other licenses included.

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
