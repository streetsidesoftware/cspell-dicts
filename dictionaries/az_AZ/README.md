# CSpell Azerbaijani Dictionary

Azerbaijani dictionary for cspell.

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
npm install -D @cspell/dict-az-az
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-az-az/cspell-ext.json"],
  "cSpell.language": "az, az-AZ",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-az-az/cspell-ext.json"],
  "language": "az, az-AZ",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-az-az/cspell-ext.json'
language: az, az-AZ
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-az-az@1/cspell-ext.json"],
  "cSpell.language": "az, az-AZ",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-az-az@1/cspell-ext.json"],
  "language": "az, az-AZ",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-az-az@1/cspell-ext.json
language: az, az-AZ
```

</details>

## Dictionary Information

| Name    | Enabled | Description                        |
| ------- | ------- | ---------------------------------- |
| `az-az` |         | Azerbaijani dictionary for cspell. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `az-az` | `az`, `az-AZ` | `*`       |

<!--- @@inject-end: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Contributing

Please help correct any mistakes in the dictionaries.

See: [Contributing](https://github.com/streetsidesoftware/cspell-dicts#contributing)

Special thanks to all of our amazing contributors!

### Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

Keep in mind that due to the behavior of this library, the letter "İ" is problematic, and is better handled carefully. Notice how all the 
words that begin with i in this dictionary are capitalized. This allows both the capitalized and lowercased versions of the words to be 
recognized.

<!--- @@inject-end: ../../static/contributing.md --->

## Resources

The Hunspell dictionary files (`az.dic` and `az.aff`) are sourced from the [mozillaz/spellchecker](https://github.com/mozillaz/spellchecker) project, which provides Azerbaijani spell-checking support for Firefox and other applications.

Another, additional dictionary has been sourced from [Hugging Face](https://huggingface.
co/datasets/LocalDoc/azerbaijani_spelling_dictionary_2021) by `vrashad`.

<!-- cspell:ignore mozillaz -->

## License

MIT

> Some packages may have other licenses included. The Hunspell dictionary source is licensed under the Mozilla Public License 2.0 (MPL-2.0).

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
