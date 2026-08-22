# CSpell Belarusian Dictionary

Belarusian dictionary for cspell.

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
npm install -D @cspell/dict-be-by
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-be-by/cspell-ext.json"],
  "cSpell.language": "be, be-BY",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-be-by/cspell-ext.json"],
  "language": "be, be-BY",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-be-by/cspell-ext.json'
language: be, be-BY
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-be-by@1/cspell-ext.json"],
  "cSpell.language": "be, be-BY",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-be-by@1/cspell-ext.json"],
  "language": "be, be-BY",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-be-by@1/cspell-ext.json
language: be, be-BY
```

</details>

## Dictionary Information

| Name    | Enabled | Description                       |
| ------- | ------- | --------------------------------- |
| `be-by` |         | Belarusian dictionary for cspell. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `be-by` | `be`, `be-BY` | `*`       |

<!--- @@inject-end: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Contributing

Please help correct any mistakes in the dictionaries.

See: [Contributing](https://github.com/streetsidesoftware/cspell-dicts#contributing)

Special thanks to all of our amazing contributors!

### Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

<!--- @@inject-end: ../../static/contributing.md --->

## Source

The source Hunspell dictionary files are from the Belarusian proofing tools package:

- <https://spell.by-reservation.com/>
- Hunspell package: <https://spell.by-reservation.com/download/hunspell/hunspell_be_v0.5.2.zip>

The upstream package credits RZR team and Belarusian N-corpus / BNKorpus.info. BNKorpus states that the grammar database used by the proofing tools is distributed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

<!-- cspell:word BNKorpus -->

## License

CC BY-SA 4.0

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
