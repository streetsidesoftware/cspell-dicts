## Local Installation

```sh
npm install -D @cspell/dict-az-az
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-az-az/cspell-ext.json"],
  "cSpell.language": "az, az-AZ",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-az-az/cspell-ext.json"],
  "language": "az, az-AZ",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-az-az/cspell-ext.json'
language: az, az-AZ
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-az-az@1/cspell-ext.json"],
  "cSpell.language": "az, az-AZ",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-az-az@1/cspell-ext.json"],
  "language": "az, az-AZ",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-az-az@1/cspell-ext.json
language: az, az-AZ
dictionaries:
  - az-az
```

</details>

## Dictionary Information

| Name    | Enabled | Description                        |
| ------- | ------- | ---------------------------------- |
| `az-az` |         | Azerbaijani dictionary for cspell. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `az-az` | `az`, `az-AZ` | `*`       |
