# CSpell Latvian Dictionary

Latvian dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

<!--- @@inject: ../../static/requirements.md --->

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 8`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 4`  |

<!--- @@inject-end: ../../static/requirements.md --->

<!--- @@inject: ./static/install.md --->

## Local Installation

```sh
npm install -D @cspell/dict-lv
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-lv/cspell-ext.json"],
  "cSpell.language": "lv",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-lv/cspell-ext.json"],
  "language": "lv",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-lv/cspell-ext.json'
language: lv
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-lv@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "lv",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-lv@latest/cspell-ext.json/cspell-ext.json"],
  "language": "lv",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-lv@latest/cspell-ext.json/cspell-ext.json
language: lv
```

</details>

<!--- @@inject-end: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Contributing

Please help correct any mistakes in the dictionaries.

See: [Contributing](https://github.com/streetsidesoftware/cspell-dicts#contributing)

Special thanks to all of our amazing contributors!

### Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

<!--- @@inject-end: ../../static/contributing.md --->

## License

LGPL-3.0

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
