## Local Installation

```sh
npm install -D @cspell/dict-uk-ua
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-uk-ua/cspell-ext.json"],
  "cSpell.language": "uk",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-uk-ua/cspell-ext.json"],
  "language": "uk",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-uk-ua/cspell-ext.json'
language: uk
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-uk-ua@4/cspell-ext.json"],
  "cSpell.language": "uk",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-uk-ua@4/cspell-ext.json"],
  "language": "uk",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-uk-ua@4/cspell-ext.json
language: uk
```

</details>

## Dictionary Information

| Name    | Enabled | Description          |
| ------- | ------- | -------------------- |
| `uk-ua` |         | Ukrainian Dictionary |

## Language Settings

| Name    | Locale | File Type |
| ------- | ------ | --------- |
| `uk-ua` | `uk`   | `*`       |
