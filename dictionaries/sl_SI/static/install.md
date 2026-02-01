## Local Installation

```sh
npm install -D @cspell/dict-sl-si
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-sl-si/cspell-ext.json"],
  "cSpell.language": "sl, sl-SI",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-sl-si/cspell-ext.json"],
  "language": "sl, sl-SI",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-sl-si/cspell-ext.json'
language: sl, sl-SI
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sl-si@1/cspell-ext.json"],
  "cSpell.language": "sl, sl-SI",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sl-si@1/cspell-ext.json"],
  "language": "sl, sl-SI",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-sl-si@1/cspell-ext.json
language: sl, sl-SI
```

</details>

## Dictionary Information

| Name    | Enabled | Description           |
| ------- | ------- | --------------------- |
| `sl-si` |         | Slovenian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `sl-si` | `sl`, `sl-SI` | `*`       |
