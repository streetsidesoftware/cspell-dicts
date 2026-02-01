# CSpell Polish Dictionary

Polish dictionary for cspell.

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
npm install -D @cspell/dict-pl_pl
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-pl_pl/cspell-ext.json"],
  "cSpell.language": "pl, pl_PL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-pl_pl/cspell-ext.json"],
  "language": "pl, pl_PL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-pl_pl/cspell-ext.json'
language: pl, pl_PL
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pl_pl@3/cspell-ext.json"],
  "cSpell.language": "pl, pl_PL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pl_pl@3/cspell-ext.json"],
  "language": "pl, pl_PL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-pl_pl@3/cspell-ext.json
language: pl, pl_PL
```

</details>

## Dictionary Information

| Name    | Enabled | Description       |
| ------- | ------- | ----------------- |
| `pl-pl` |         | Polish Dictionary |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `pl-pl` | `pl`, `pl_PL` | `*`       |

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

The Hunspell source for this dictionary can be found in several repositories:

- [titoBouzout/Dictionaries](https://github.com/titoBouzout/Dictionaries)
- [dictionaries/pl_PL](https://github.com/wooorm/dictionaries/tree/master/dictionaries/pl_PL)

<!--- cspell:ignore titoBouzout --->

## License

LGPL-3.0+

> Some packages may have other licenses included.
> See [src/hunspell/license](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/src/hunspell/license)

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
