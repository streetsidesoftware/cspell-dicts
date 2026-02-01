## Local Installation

```sh
npm install -D @cspell/dict-da-dk
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-da-dk/cspell-ext.json"],
  "cSpell.language": "da, da-DK",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-da-dk/cspell-ext.json"],
  "language": "da, da-DK",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-da-dk/cspell-ext.json'
language: da, da-DK
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-da-dk@4/cspell-ext.json"],
  "cSpell.language": "da, da-DK",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-da-dk@4/cspell-ext.json"],
  "language": "da, da-DK",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-da-dk@4/cspell-ext.json
language: da, da-DK
```

</details>

## Dictionary Information

| Name    | Enabled | Description                |
| ------- | ------- | -------------------------- |
| `da-dk` |         | Danish (da-DK) Dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `da-dk` | `da`, `da-DK` | `*`       |
