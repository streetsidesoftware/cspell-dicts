# CSpell British English (-ise) Dictionary

British English dictionary for cspell.

Use this dictionary if you do not want the (-ize) spelling variants commonly used in US English.

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
npm install -D @cspell/dict-en-gb-ise
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-en-gb-ise/cspell-ext.json"],
  "cSpell.language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-en-gb-ise/cspell-ext.json"],
  "language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-en-gb-ise/cspell-ext.json'
language: en-GB
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-gb-ise@1/cspell-ext.json"],
  "cSpell.language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-gb-ise@1/cspell-ext.json"],
  "language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-en-gb-ise@1/cspell-ext.json
language: en-GB
```

</details>

## Dictionary Information

| Name    | Enabled | Description                |
| ------- | ------- | -------------------------- |
| `en-gb` |         | British English Dictionary |

## Language Settings

| Name    | Locale  | File Type |
| ------- | ------- | --------- |
| `en-gb` | `en-GB` | `*`       |

<!--- @@inject-end: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Contributing

Please help correct any mistakes in the dictionaries.

See: [Contributing](https://github.com/streetsidesoftware/cspell-dicts#contributing)

Special thanks to all of our amazing contributors!

### Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

<!--- @@inject-end: ../../static/contributing.md --->

## Adding Words

Contributions are welcomed and encouraged, please read [src/README.md](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/en_GB-ise/src/README.md).

## License

The code used to build this dictionary is licensed under `MIT` license.

But because of the sources it includes, the `@cspell/dict-en-gb-ise` package is released under:

LGPL-3.0-or-later

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
