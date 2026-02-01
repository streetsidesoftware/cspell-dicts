## Local Installation

```sh
npm install -D @cspell/dict-ro-ro
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-ro-ro/cspell-ext.json"],
  "cSpell.language": "ro, ro-RO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-ro-ro/cspell-ext.json"],
  "language": "ro, ro-RO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-ro-ro/cspell-ext.json'
language: ro, ro-RO
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ro-ro@2/cspell-ext.json"],
  "cSpell.language": "ro, ro-RO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ro-ro@2/cspell-ext.json"],
  "language": "ro, ro-RO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-ro-ro@2/cspell-ext.json
language: ro, ro-RO
```

</details>

## Dictionary Information

| Name    | Enabled | Description          |
| ------- | ------- | -------------------- |
| `ro-ro` |         | Romanian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `ro-ro` | `ro`, `ro-RO` | `*`       |
