## Local Installation

```sh
npm install -D @cspell/dict-eu
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-eu/cspell-ext.json"],
  "cSpell.language": "eu",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-eu/cspell-ext.json"],
  "language": "eu",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-eu/cspell-ext.json'
language: eu
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-eu@1/cspell-ext.json"],
  "cSpell.language": "eu",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-eu@1/cspell-ext.json"],
  "language": "eu",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-eu@1/cspell-ext.json
language: eu
```

</details>

## Dictionary Information

| Name | Enabled | Description        |
| ---- | ------- | ------------------ |
| `eu` |         | Basque dictionary. |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `eu` | `eu`   | `*`       |
