# CSpell html Dictionary

Html dictionary for cspell.

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

**This package is bundled with CSpell.**

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.dictionaries": ["html"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "dictionaries": ["html"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
dictionaries:
  - html
```

</details>

## Local Installation using CDN

> **NOTE:** This package is bundled with CSpell.

## Dictionary Information

| Name   | Enabled | Description      |
| ------ | ------- | ---------------- |
| `html` |         | HTML dictionary. |

## Language Settings

| Name   | Locale | File Type |
| ------ | ------ | --------- |
| `html` | `*`    | `html`    |

## Predefined Patterns

Predefined patterns can be used to ignore or include sequences of text to be spell checked.

The following patterns are defined in this dictionary:

| Name                               | Description                                                             |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `HTML-id`                          | Matches values inside a double quoted 'id' attribute                    |
| `HTML-src`                         | Matches values inside a double quoted 'src' attribute                   |
| `HTML-class`                       | Matches values inside a double quoted 'class' attribute                 |
| `HTML-IDREF-aria-activedescendant` | Matches values inside a double quoted 'aria-activedescendant' attribute |
| `HTML-IDREF-aria-controls`         | Matches values inside a double quoted 'aria-controls' attribute         |
| `HTML-IDREF-aria-describedby`      | Matches values inside a double quoted 'aria-describedby' attribute      |
| `HTML-IDREF-aria-details`          | Matches values inside a double quoted 'aria-details' attribute          |
| `HTML-IDREF-aria-errormessage`     | Matches values inside a double quoted 'aria-error' attribute            |
| `HTML-IDREF-aria-flowto`           | Matches values inside a double quoted 'aria-flowto' attribute           |
| `HTML-IDREF-aria-labelledby`       | Matches values inside a double quoted 'aria-labelledby' attribute       |
| `HTML-IDREF-aria-owns`             | Matches values inside a double quoted 'aria-owns' attribute             |
| `HTML-IDREF-for`                   | Matches values inside a double quoted 'for' attribute                   |
| `HTML-symbol-entity`               | Matches on HTML symbols like `&clubs;`                                  |

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

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
