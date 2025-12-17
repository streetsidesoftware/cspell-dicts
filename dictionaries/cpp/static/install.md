## Local Installation

**This package is bundled with CSpell.**

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.dictionaries": ["cpp-legacy", "cpp", "cpp-compound-words", "cpp-refined"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "dictionaries": ["cpp-legacy", "cpp", "cpp-compound-words", "cpp-refined"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
dictionaries:
  - cpp-legacy
  - cpp
  - cpp-compound-words
  - cpp-refined
```

</details>

## Local Installation using CDN

> **NOTE:** This package is bundled with CSpell.

## Dictionary Information

| Name                 | Enabled | Description                                                  |
| -------------------- | ------- | ------------------------------------------------------------ |
| `cpp-legacy`         |         | Legacy C/C++ Keywords and common library functions.          |
| `cpp`                |         | C/C++ Keywords and common library functions.                 |
| `cpp-compound-words` |         | C/C++ Common word compounds.                                 |
| `cpp-refined`        |         | Refined list of C/C++ Keywords and common library functions. |

## Language Settings

| Name                 | Locale | File Type  |
| -------------------- | ------ | ---------- |
| `cpp-legacy`         | `*`    | `c`, `cpp` |
| `cpp`                | `*`    | `c`, `cpp` |
| `cpp-compound-words` | `*`    | `c`, `cpp` |
| `cpp-refined`        | `*`    | `c`, `cpp` |
