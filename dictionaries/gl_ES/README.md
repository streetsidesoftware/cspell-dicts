# CSpell Galician Dictionary (Spain)

Galician Dictionary (Spain)

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-gl-es
cspell link add @cspell/dict-gl-es
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-gl-es
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-gl-es
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-gl-es/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

MIT

> Some packages may have other licenses included.

## Acknowledgements

Contributed by:

- [Borja Paz Rodríguez](https://github.com/borjapazr)

This dictionary makes use of the following open source projects:

- [hunspell-gl](https://gitlab.com/trasno/hunspell-gl) ([Proxecto Trasno](https://trasno.gal/))

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
