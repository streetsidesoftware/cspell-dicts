## Local Installation

```sh
npm install -D @cspell/dict-pt-br
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-pt-br/cspell-ext.json"],
  "cSpell.language": "pt, pt_BR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-pt-br/cspell-ext.json"],
  "language": "pt, pt_BR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-pt-br/cspell-ext.json'
language: pt, pt_BR
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pt-br@2/cspell-ext.json"],
  "cSpell.language": "pt, pt_BR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pt-br@2/cspell-ext.json"],
  "language": "pt, pt_BR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-pt-br@2/cspell-ext.json
language: pt, pt_BR
```

</details>

## Dictionary Information

| Name    | Enabled | Description                       |
| ------- | ------- | --------------------------------- |
| `pt-br` |         | Portuguese (Brazilian) Dictionary |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `pt-br` | `pt`, `pt_BR` | `*`       |
