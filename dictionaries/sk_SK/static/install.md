## Local Installation

```sh
npm install -D @cspell/dict-sk-sk
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-sk-sk/cspell-ext.json"],
  "cSpell.language": "sk",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-sk-sk/cspell-ext.json"],
  "language": "sk",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-sk-sk/cspell-ext.json'
language: sk
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sk-sk@1/cspell-ext.json"],
  "cSpell.language": "sk",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sk-sk@1/cspell-ext.json"],
  "language": "sk",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-sk-sk@1/cspell-ext.json
language: sk
```

</details>

## Dictionary Information

| Name    | Enabled | Description        |
| ------- | ------- | ------------------ |
| `sk-sk` |         | Slovak dictionary. |

## Language Settings

| Name    | Locale | File Type |
| ------- | ------ | --------- |
| `sk-sk` | `sk`   | `*`       |
