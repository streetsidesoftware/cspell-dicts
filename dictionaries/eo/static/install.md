## Local Installation

```sh
npm install -D @cspell/dict-eo
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-eo/cspell-ext.json"],
  "cSpell.language": "eo",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-eo/cspell-ext.json"],
  "language": "eo",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-eo/cspell-ext.json'
language: eo
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-eo@3/cspell-ext.json"],
  "cSpell.language": "eo",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-eo@3/cspell-ext.json"],
  "language": "eo",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-eo@3/cspell-ext.json
language: eo
```

</details>

## Dictionary Information

| Name | Enabled | Description           |
| ---- | ------- | --------------------- |
| `eo` |         | Esperanto dictionary. |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `eo` | `eo`   | `*`       |
