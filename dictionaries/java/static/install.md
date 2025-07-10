## Local Installation

**This package is bundled with CSpell.**

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.dictionaries": ["java"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "dictionaries": ["java"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
dictionaries:
  - java
```

</details>

## Local Installation using CDN

> **NOTE:** This package is bundled with CSpell.

## Dictionary Information

| Name   | Enabled | Description      |
| ------ | ------- | ---------------- |
| `java` |         | Java dictionary. |

## Language Settings

| Name   | Locale | File Type |
| ------ | ------ | --------- |
| `java` | `*`    | `java`    |

## Predefined Patterns

Predefined patterns can be used to ignore or include sequences of text to be spell checked.

The following patterns are defined in this dictionary:

| Name                    | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| `java-statement-import` | Matches the import statement                                    |
| `java-member-function`  | Ignore member functions etc, these are checked by the compiler. |
