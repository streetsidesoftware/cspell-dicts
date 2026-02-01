## Local Installation

```sh
npm install -D @cspell/dict-ar
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-ar/cspell-ext.json"],
  "cSpell.language": "ar",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-ar/cspell-ext.json"],
  "language": "ar",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-ar/cspell-ext.json'
language: ar
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ar@1/cspell-ext.json"],
  "cSpell.language": "ar",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ar@1/cspell-ext.json"],
  "language": "ar",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-ar@1/cspell-ext.json
language: ar
```

</details>

## Dictionary Information

| Name | Enabled | Description        |
| ---- | ------- | ------------------ |
| `ar` |         | Arabic dictionary. |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `ar` | `ar`   | `*`       |
