# CSpell French Dictionary

French dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-fr-fr
cspell link add @cspell/dict-fr-fr
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-fr-fr
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-fr-fr/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Resources

The Hunspell source for this dictionary can be found:

- <http://code.grammalecte.net:8080/home>

## License

MIT

See also: [French.txt](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/fr_FR/src/hunspell-french-dictionaries-v7.0/README_dict_fr.txt)

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
