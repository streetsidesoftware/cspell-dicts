## Local Installation

```sh
npm install -D @cspell/dict-fa-ir
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-fa-ir/cspell-ext.json"],
  "cSpell.language": "fa, fa-IR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-fa-ir/cspell-ext.json"],
  "language": "fa, fa-IR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-fa-ir/cspell-ext.json'
language: fa, fa-IR
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fa-ir@4/cspell-ext.json"],
  "cSpell.language": "fa, fa-IR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fa-ir@4/cspell-ext.json"],
  "language": "fa, fa-IR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-fa-ir@4/cspell-ext.json
language: fa, fa-IR
```

</details>

## Dictionary Information

| Name    | Enabled | Description        |
| ------- | ------- | ------------------ |
| `fa-ir` |         | Persian Dictionary |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `fa-ir` | `fa`, `fa-IR` | `*`       |
