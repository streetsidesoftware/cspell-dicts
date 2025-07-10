# CSpell Russian Dictionary

Russian dictionary for cspell.

This is a pre-built dictionary for use with cspell.

It combines

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
npm install -D @cspell/dict-ru_ru
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-ru_ru/cspell-ext.json"],
  "cSpell.language": "ru, ru-ru",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-ru_ru/cspell-ext.json"],
  "language": "ru, ru-ru",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-ru_ru/cspell-ext.json'
language: ru, ru-ru
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ru_ru@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "ru, ru-ru",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ru_ru@latest/cspell-ext.json/cspell-ext.json"],
  "language": "ru, ru-ru",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-ru_ru@latest/cspell-ext.json/cspell-ext.json
language: ru, ru-ru
```

</details>

## Dictionary Information

| Name    | Enabled | Description                   |
| ------- | ------- | ----------------------------- |
| `ru-ru` |         | Russian Dictionary (Combined) |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `ru-ru` | `ru`, `ru-ru` | `*`       |

<!--- @@inject-end: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Contributing

Please help correct any mistakes in the dictionaries.

See: [Contributing](https://github.com/streetsidesoftware/cspell-dicts#contributing)

Special thanks to all of our amazing contributors!

### Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

<!--- @@inject-end: ../../static/contributing.md --->

## Resources

The Hunspell source for this dictionary can be found:

- [dictionaries/ru_RU](https://github.com/wooorm/dictionaries/tree/master/dictionaries/ru_RU)

## License

GPL-3.0-or-later

> Some packages may have other licenses included.

# Contributing

## Adding Missing Words

Please add words to [additional_words.txt](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/ru_RU/src/additional_words.txt)

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
