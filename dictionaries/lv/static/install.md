## Local Installation

```sh
npm install -D @cspell/dict-lv
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-lv/cspell-ext.json"],
  "cSpell.language": "lv",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-lv/cspell-ext.json"],
  "language": "lv",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-lv/cspell-ext.json'
language: lv
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-lv@1/cspell-ext.json"],
  "cSpell.language": "lv",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-lv@1/cspell-ext.json"],
  "language": "lv",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-lv@1/cspell-ext.json
language: lv
```

</details>

## Dictionary Information

| Name | Enabled | Description         |
| ---- | ------- | ------------------- |
| `lv` |         | Latvian dictionary. |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `lv` | `lv`   | `*`       |
