## Local Installation

**This package is bundled with CSpell.**

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.dictionaries": ["typescript"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "dictionaries": ["typescript"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
dictionaries:
  - typescript
```

</details>

## Local Installation using CDN

> **NOTE:** This package is bundled with CSpell.

## Dictionary Information

| Name                   | Enabled | Description                           |
| ---------------------- | ------- | ------------------------------------- |
| `typescript`           |         | TypeScript and JavaScript dictionary. |
| `html`                 |         | _External_                            |
| `html-symbol-entities` |         | _External_                            |

## Language Settings

| Name                   | Locale | File Type                                                                        |
| ---------------------- | ------ | -------------------------------------------------------------------------------- |
| `typescript`           | `*`    | `typescript`, `javascript`, `typescriptreact`, `javascriptreact`, `mdx`, `astro` |
| `html`                 |        | `astro`                                                                          |
| `html-symbol-entities` |        | `astro`                                                                          |

## Predefined Patterns

Predefined patterns can be used to ignore or include sequences of text to be spell checked.

The following patterns are defined in this dictionary:

| Name                | Description                                     |
| ------------------- | ----------------------------------------------- |
| `js-hex-number`     | JavaScript Hexadecimal Number including BigInt. |
| `js-hex-escape`     | JavaScript String Hexadecimal Escape sequence.  |
| `js-unicode-escape` | JavaScript String Unicode Escape sequence.      |
| `js-regexp-flags`   | JavaScript Match Regular Expression Flags       |
