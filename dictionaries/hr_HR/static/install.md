## Local Installation

```sh
npm install -D @cspell/dict-hr-hr
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-hr-hr/cspell-ext.json"],
  "cSpell.language": "hr, hr-HR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-hr-hr/cspell-ext.json"],
  "language": "hr, hr-HR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-hr-hr/cspell-ext.json'
language: hr, hr-HR
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-hr-hr@3/cspell-ext.json"],
  "cSpell.language": "hr, hr-HR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-hr-hr@3/cspell-ext.json"],
  "language": "hr, hr-HR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-hr-hr@3/cspell-ext.json
language: hr, hr-HR
```

</details>

## Dictionary Information

| Name    | Enabled | Description          |
| ------- | ------- | -------------------- |
| `hr-hr` |         | Croatian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `hr-hr` | `hr`, `hr-HR` | `*`       |
