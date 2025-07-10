## Local Installation

**This package is bundled with CSpell.**

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.dictionaries": ["sql"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "dictionaries": ["sql"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
dictionaries:
  - sql
```

</details>

## Local Installation using CDN

> **NOTE:** This package is bundled with CSpell.

## Dictionary Information

| Name  | Enabled | Description     |
| ----- | ------- | --------------- |
| `sql` |         | SQL dictionary. |

## Language Settings

| Name  | Locale | File Type |
| ----- | ------ | --------- |
| `sql` | `*`    | `sql`     |

## Predefined Patterns

Predefined patterns can be used to ignore or include sequences of text to be spell checked.

The following patterns are defined in this dictionary:

| Name                        | Description |
| --------------------------- | ----------- |
| `sql-hex-number`            |             |
| `sql-unicode-string-prefix` |             |
