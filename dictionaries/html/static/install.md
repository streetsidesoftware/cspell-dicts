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

| Name                               | Description                            |
| ---------------------------------- | -------------------------------------- |
| `HTML-id`                          |                                        |
| `HTML-src`                         |                                        |
| `HTML-class`                       |                                        |
| `HTML-IDREF-aria-activedescendant` |                                        |
| `HTML-IDREF-aria-controls`         |                                        |
| `HTML-IDREF-aria-describedby`      |                                        |
| `HTML-IDREF-aria-details`          |                                        |
| `HTML-IDREF-aria-errormessage`     |                                        |
| `HTML-IDREF-aria-flowto`           |                                        |
| `HTML-IDREF-aria-labelledby`       |                                        |
| `HTML-IDREF-aria-owns`             |                                        |
| `HTML-IDREF-for`                   |                                        |
| `HTML-symbol-entity`               | Matches on HTML symbols like `&clubs;` |
