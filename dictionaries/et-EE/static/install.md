## Local Installation

```sh
npm install -D @cspell/dict-et-ee
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-et-ee/cspell-ext.json"],
  "cSpell.language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-et-ee/cspell-ext.json"],
  "language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-et-ee/cspell-ext.json'
language: et, et-EE
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-et-ee@3/cspell-ext.json"],
  "cSpell.language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-et-ee@3/cspell-ext.json"],
  "language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-et-ee@3/cspell-ext.json
language: et, et-EE
```

</details>

## Dictionary Information

| Name    | Enabled | Description          |
| ------- | ------- | -------------------- |
| `et-ee` |         | Estonian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `et-ee` | `et`, `et-EE` | `*`       |
