## Local Installation

```sh
npm install -D @cspell/dict-mn-mn
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-mn-mn/cspell-ext.json"],
  "cSpell.language": "mn, mn-MN",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-mn-mn/cspell-ext.json"],
  "language": "mn, mn-MN",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-mn-mn/cspell-ext.json'
language: mn, mn-MN
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mn-mn@1/cspell-ext.json"],
  "cSpell.language": "mn, mn-MN",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mn-mn@1/cspell-ext.json"],
  "language": "mn, mn-MN",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-mn-mn@1/cspell-ext.json
language: mn, mn-MN
```

</details>

## Dictionary Information

| Name    | Enabled | Description           |
| ------- | ------- | --------------------- |
| `mn-mn` |         | Mongolian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `mn-mn` | `mn`, `mn-MN` | `*`       |
