## Local Installation

```sh
npm install -D @cspell/dict-el
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-el/cspell-ext.json"],
  "cSpell.language": "el",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-el/cspell-ext.json"],
  "language": "el",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-el/cspell-ext.json'
language: el
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-el@3/cspell-ext.json"],
  "cSpell.language": "el",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-el@3/cspell-ext.json"],
  "language": "el",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-el@3/cspell-ext.json
language: el
```

</details>

## Dictionary Information

| Name | Enabled | Description       |
| ---- | ------- | ----------------- |
| `el` |         | Greek dictionary. |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `el` | `el`   | `*`       |
