## Local Installation

```sh
npm install -D @cspell/dict-he
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-he/cspell-ext.json"],
  "cSpell.language": "he",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-he/cspell-ext.json"],
  "language": "he",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-he/cspell-ext.json'
language: he
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-he@4/cspell-ext.json"],
  "cSpell.language": "he",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-he@4/cspell-ext.json"],
  "language": "he",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-he@4/cspell-ext.json
language: he
```

</details>

## Dictionary Information

| Name | Enabled | Description       |
| ---- | ------- | ----------------- |
| `he` |         | Hebrew Dictionary |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `he` | `he`   | `*`       |
