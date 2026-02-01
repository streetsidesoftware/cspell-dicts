# CSpell Estonian Dictionary

This is a CSpell repackaging of the [wordlist](http://www.meso.ee/~jjpp/speller/)
created by Jaak Pruulmann.

The following description has been taken from the webpage of the original author:

## Wordlists

The wordlists are based on work by the Institute of the Estonian Language,
subsequently improved by Jaak Pruulmann who also created the affix file.

## Encoding issues

All dictionaries are encoded in the UTF-8 character-set,
which is absolutely necessary to accommodate the plethora of foreign words
featuring S- and Z-caron that see daily usage in the Estonian language.

Dictionaries to accommodate the ISO-8859-1 legacy encoding still used on
some operating systems are also included for completion, but obviously
won't successfully proofread words that use S and Z with a caron accent.

## Wordlist improvement

Corrections to existing words and suggestions for new words are welcome.
Please send them to the author for inclusion in the next revision.

## Contact Information

Jaak Pruulmann <jjpp@meso.ee>

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
npm install -D @cspell/dict-et-ee
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-et-ee/cspell-ext.json"],
  "cSpell.language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-et-ee/cspell-ext.json"],
  "language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-et-ee/cspell-ext.json'
language: et, et-EE
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-et-ee@3/cspell-ext.json"],
  "cSpell.language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-et-ee@3/cspell-ext.json"],
  "language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-et-ee@3/cspell-ext.json
language: et, et-EE
```

</details>

## Dictionary Information

| Name    | Enabled | Description          |
| ------- | ------- | -------------------- |
| `et-ee` |         | Estonian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `et-ee` | `et`, `et-EE` | `*`       |

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

LGPL 3.0

> Some packages may have other licenses included.

<!---
cspell:ignore wordlist wordlists
-->

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
