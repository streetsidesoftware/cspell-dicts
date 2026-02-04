# CSpell Scientific Terms US Dictionary

Scientific Terms US dictionary for cspell.

The words for this dictionary came from [John Petrie’s LifeBlag](http://www.jpetrie.net/scientific-word-list-for-spell-checkersspelling-dictionaries/)

This is a pre-built dictionary for use with cspell.

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
npm install -D @cspell/dict-scientific-terms-us
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-scientific-terms-us/cspell-ext.json"],
  "cSpell.dictionaries": ["scientific-terms-us", "mathematics-terms-us"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-scientific-terms-us/cspell-ext.json"],
  "dictionaries": ["scientific-terms-us", "mathematics-terms-us"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-scientific-terms-us/cspell-ext.json'
dictionaries:
  - scientific-terms-us
  - mathematics-terms-us
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-us@3/cspell-ext.json"],
  "cSpell.dictionaries": ["scientific-terms-us", "mathematics-terms-us"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-us@3/cspell-ext.json"],
  "dictionaries": ["scientific-terms-us", "mathematics-terms-us"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-us@3/cspell-ext.json
dictionaries:
  - scientific-terms-us
  - mathematics-terms-us
```

</details>

## Dictionary Information

| Name                   | Enabled | Description                      |
| ---------------------- | ------- | -------------------------------- |
| `scientific-terms-us`  | **Yes** | Scientific Terms US dictionary.  |
| `mathematics-terms-us` | **Yes** | Mathematics Terms US dictionary. |

## Language Settings

| Name                   | Locale | File Type |
| ---------------------- | ------ | --------- |
| `scientific-terms-us`  | `*`    | `*`       |
| `mathematics-terms-us` | `*`    | `*`       |

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

MIT

> Some packages may have other licenses included.

<!--- cspell:ignore Petrie’s --->

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
