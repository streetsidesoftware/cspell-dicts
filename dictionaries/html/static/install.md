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
