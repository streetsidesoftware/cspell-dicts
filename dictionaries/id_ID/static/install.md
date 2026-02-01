## Local Installation

```sh
npm install -D @cspell/dict-id-id
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-id-id/cspell-ext.json"],
  "cSpell.language": "id, id-ID",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-id-id/cspell-ext.json"],
  "language": "id, id-ID",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-id-id/cspell-ext.json'
language: id, id-ID
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-id-id@1/cspell-ext.json"],
  "cSpell.language": "id, id-ID",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-id-id@1/cspell-ext.json"],
  "language": "id, id-ID",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-id-id@1/cspell-ext.json
language: id, id-ID
```

</details>

## Dictionary Information

| Name    | Enabled | Description           |
| ------- | ------- | --------------------- |
| `id-id` |         | Indonesia dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `id-id` | `id`, `id-ID` | `*`       |
