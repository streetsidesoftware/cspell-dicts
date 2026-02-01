## Local Installation

```sh
npm install -D @cspell/dict-sr-latn
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-sr-latn/cspell-ext.json"],
  "cSpell.language": "sr, sr-Latn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-sr-latn/cspell-ext.json"],
  "language": "sr, sr-Latn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-sr-latn/cspell-ext.json'
language: sr, sr-Latn
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sr-latn@1/cspell-ext.json"],
  "cSpell.language": "sr, sr-Latn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sr-latn@1/cspell-ext.json"],
  "language": "sr, sr-Latn",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-sr-latn@1/cspell-ext.json
language: sr, sr-Latn
```

</details>

## Dictionary Information

| Name      | Enabled | Description                 |
| --------- | ------- | --------------------------- |
| `sr-latn` |         | Serbian (Latin) dictionary. |

## Language Settings

| Name      | Locale          | File Type |
| --------- | --------------- | --------- |
| `sr-latn` | `sr`, `sr-Latn` | `*`       |
