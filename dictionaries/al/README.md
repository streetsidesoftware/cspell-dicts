# CSpell AL Dictionary

AL Dictionary

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-al
cspell link add @cspell/dict-al
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-al
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```npm
npm i @cspell/dict-al
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-al/cspell-ext.json"],
    // …
}
```

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
