# CSpell Serbian (Latin) Dictionary

Serbian (Latin) dictionary for cspell.

This is a pre-built dictionary for use with CSpell. The word list is based on
Milutin Smiljanić's [korektor](https://github.com/msmiljan/korektor). The cspell
dictionary has been compiled and is maintained by [Toma Tasovac](https://github.com/ttasovac).

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
npm install -D @cspell/dict-sr-latn
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-sr-latn/cspell-ext.json"],
  "cSpell.language": "sr, sr-Latn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-sr-latn/cspell-ext.json"],
  "language": "sr, sr-Latn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-sr-latn/cspell-ext.json'
language: sr, sr-Latn
```

</details>

## Local Installation using CDN

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sr-latn@1/cspell-ext.json"],
  "cSpell.language": "sr, sr-Latn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sr-latn@1/cspell-ext.json"],
  "language": "sr, sr-Latn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-sr-latn@1/cspell-ext.json
language: sr, sr-Latn
```

</details>

## Dictionary Information

| Name      | Enabled | Description                 |
| --------- | ------- | --------------------------- |
| `sr-latn` |         | Serbian (Latin) dictionary. |

## Language Settings

| Name      | Locale          | File Type |
| --------- | --------------- | --------- |
| `sr-latn` | `sr`, `sr-Latn` | `*`       |

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

GNU GPL

> Some packages may have other licenses included.

<!--- cspell:words  Milutin Smiljanić Smiljanić's korektor Toma Tasovac --->

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
