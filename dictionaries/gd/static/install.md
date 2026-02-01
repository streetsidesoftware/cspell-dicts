## Local Installation

```sh
npm install -D @cspell/dict-gd
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-gd/cspell-ext.json"],
  "cSpell.language": "gd",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-gd/cspell-ext.json"],
  "language": "gd",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-gd/cspell-ext.json'
language: gd
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gd@1/cspell-ext.json"],
  "cSpell.language": "gd",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gd@1/cspell-ext.json"],
  "language": "gd",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-gd@1/cspell-ext.json
language: gd
```

</details>

## Dictionary Information

| Name | Enabled | Description                |
| ---- | ------- | -------------------------- |
| `gd` |         | Scottish Gaelic dictionary |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `gd` | `gd`   | `*`       |
