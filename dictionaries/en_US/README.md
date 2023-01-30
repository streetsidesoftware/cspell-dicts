# CSpell English Dictionary

English dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Note

This dictionary comes pre-installed with cspell. It should not be necessary to add it.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-en_us
cspell link add @cspell/dict-en_us
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-en_us
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-en_us/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Adding Words

Please add any words to [src/additional_words.txt](./src/additional_words.txt) by making a pull request.

## Resources

The Hunspell source for this dictionary can be found:

<http://wordlist.aspell.net/hunspell-readme/>

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
