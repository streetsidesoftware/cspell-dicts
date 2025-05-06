# CSpell British English (-ise) Dictionary

British English dictionary for cspell.

Use this dictionary if you do not want the (-ize) spelling variants commonly used in US English.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-en-gb-ise
cspell link add @cspell/dict-en-gb-ise
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-en-gb-ise
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-en-gb-ise/cspell-ext.json"],
    // …
}
```

## Adding Words

Contributions are welcomed and encouraged, please read [src/README.md](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/en_GB-ise/src/README.md).

## License

The code used to build this dictionary is licensed under `MIT` license.

But because of the sources it includes, the `@cspell/dict-en-gb-ise` package is released under:

LGPL-3.0-or-later

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
