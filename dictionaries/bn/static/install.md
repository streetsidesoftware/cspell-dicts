## Local Installation

```sh
npm install -D @cspell/dict-bn
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-bn/cspell-ext.json"],
  "cSpell.language": "bn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-bn/cspell-ext.json"],
  "language": "bn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-bn/cspell-ext.json'
language: bn
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-bn@1/cspell-ext.json"],
  "cSpell.language": "bn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-bn@1/cspell-ext.json"],
  "language": "bn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-bn@1/cspell-ext.json
language: bn
```

</details>

## Dictionary Information

| Name | Enabled | Description                    |
| ---- | ------- | ------------------------------ |
| `bn` |         | Bengali dictionary for cspell. |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `bn` | `bn`   | `*`       |
