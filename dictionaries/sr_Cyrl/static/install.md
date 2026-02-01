## Local Installation

```sh
npm install -D @cspell/dict-sr-cyrl
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-sr-cyrl/cspell-ext.json"],
  "cSpell.language": "sr, sr-Cyrl",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-sr-cyrl/cspell-ext.json"],
  "language": "sr, sr-Cyrl",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-sr-cyrl/cspell-ext.json'
language: sr, sr-Cyrl
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sr-cyrl@1/cspell-ext.json"],
  "cSpell.language": "sr, sr-Cyrl",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sr-cyrl@1/cspell-ext.json"],
  "language": "sr, sr-Cyrl",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-sr-cyrl@1/cspell-ext.json
language: sr, sr-Cyrl
```

</details>

## Dictionary Information

| Name      | Enabled | Description                    |
| --------- | ------- | ------------------------------ |
| `sr-cyrl` |         | Serbian (Cyrillic) dictionary. |

## Language Settings

| Name      | Locale          | File Type |
| --------- | --------------- | --------- |
| `sr-cyrl` | `sr`, `sr-Cyrl` | `*`       |
