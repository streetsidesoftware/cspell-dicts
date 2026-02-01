## Local Installation

```sh
npm install -D @cspell/dict-de-ch
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-de-ch/cspell-ext.json"],
  "cSpell.language": "de, de_CH",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-de-ch/cspell-ext.json"],
  "language": "de, de_CH",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-de-ch/cspell-ext.json'
language: de, de_CH
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-de-ch@1/cspell-ext.json"],
  "cSpell.language": "de, de_CH",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-de-ch@1/cspell-ext.json"],
  "language": "de, de_CH",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-de-ch@1/cspell-ext.json
language: de, de_CH
```

</details>

## Dictionary Information

| Name    | Enabled | Description                      |
| ------- | ------- | -------------------------------- |
| `de-ch` |         | Swiss German (de-CH) Dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `de-ch` | `de`, `de_CH` | `*`       |
