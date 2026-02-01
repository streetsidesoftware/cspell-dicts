## Local Installation

```sh
npm install -D @cspell/dict-tr-tr
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-tr-tr/cspell-ext.json"],
  "cSpell.language": "tr, tr-TR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-tr-tr/cspell-ext.json"],
  "language": "tr, tr-TR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-tr-tr/cspell-ext.json'
language: tr, tr-TR
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-tr-tr@3/cspell-ext.json"],
  "cSpell.language": "tr, tr-TR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-tr-tr@3/cspell-ext.json"],
  "language": "tr, tr-TR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-tr-tr@3/cspell-ext.json
language: tr, tr-TR
```

</details>

## Dictionary Information

| Name    | Enabled | Description         |
| ------- | ------- | ------------------- |
| `tr-tr` |         | Turkish dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `tr-tr` | `tr`, `tr-TR` | `*`       |
