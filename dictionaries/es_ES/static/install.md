## Local Installation

```sh
npm install -D @cspell/dict-es-es
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-es-es/cspell-ext.json"],
  "cSpell.language": "es, es_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-es-es/cspell-ext.json"],
  "language": "es, es_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-es-es/cspell-ext.json'
language: es, es_ES
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-es-es@3/cspell-ext.json"],
  "cSpell.language": "es, es_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-es-es@3/cspell-ext.json"],
  "language": "es, es_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-es-es@3/cspell-ext.json
language: es, es_ES
```

</details>

## Dictionary Information

| Name    | Enabled | Description                |
| ------- | ------- | -------------------------- |
| `es-es` |         | Spanish Dictionary (Spain) |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `es-es` | `es`, `es_ES` | `*`       |
