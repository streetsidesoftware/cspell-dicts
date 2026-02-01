## Local Installation

```sh
npm install -D @cspell/dict-it-it
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-it-it/cspell-ext.json"],
  "cSpell.language": "it, it-IT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-it-it/cspell-ext.json"],
  "language": "it, it-IT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-it-it/cspell-ext.json'
language: it, it-IT
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-it-it@3/cspell-ext.json"],
  "cSpell.language": "it, it-IT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-it-it@3/cspell-ext.json"],
  "language": "it, it-IT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-it-it@3/cspell-ext.json
language: it, it-IT
```

</details>

## Dictionary Information

| Name    | Enabled | Description         |
| ------- | ------- | ------------------- |
| `it-it` |         | Italian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `it-it` | `it`, `it-IT` | `*`       |
