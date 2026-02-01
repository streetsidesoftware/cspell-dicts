# CSpell he Dictionary

Dictionary for Hebrew language

This is a pre-built dictionary for use with cspell.

# About the Dictionary

The Hebrew Dictionary has been compiled from the Hunspell Hebrew Dictionary:

> By the Hspell project (<http://hspell.ivrix.org.il/>).
> Hspell version 1.4 was used.
> Copyright 2004-2017, Nadav Har'El and Dan Kenigsberg
> The dictionary (this file and the corresponding word list)
> is licensed under the GNU Affero General Public License

But, due to the complexity of the Hebrew language, a significant portion of the dictionary was not able to be
included in this extension.

<!--- cspell:ignore hspell, Nadav Har'El, Dan Kenigsberg --->

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
npm install -D @cspell/dict-he
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-he/cspell-ext.json"],
  "cSpell.language": "he",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-he/cspell-ext.json"],
  "language": "he",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-he/cspell-ext.json'
language: he
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-he@4/cspell-ext.json"],
  "cSpell.language": "he",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-he@4/cspell-ext.json"],
  "language": "he",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-he@4/cspell-ext.json
language: he
```

</details>

## Dictionary Information

| Name | Enabled | Description       |
| ---- | ------- | ----------------- |
| `he` |         | Hebrew Dictionary |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `he` | `he`   | `*`       |

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

AGPLv3

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
