## Local Installation

```sh
npm install -D @cspell/dict-lt-lt
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-lt-lt/cspell-ext.json"],
  "cSpell.language": "lt, lt-LT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-lt-lt/cspell-ext.json"],
  "language": "lt, lt-LT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-lt-lt/cspell-ext.json'
language: lt, lt-LT
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-lt-lt@4/cspell-ext.json"],
  "cSpell.language": "lt, lt-LT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-lt-lt@4/cspell-ext.json"],
  "language": "lt, lt-LT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-lt-lt@4/cspell-ext.json
language: lt, lt-LT
```

</details>

## Dictionary Information

| Name    | Enabled | Description            |
| ------- | ------- | ---------------------- |
| `lt-lt` |         | Lithuanian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `lt-lt` | `lt`, `lt-LT` | `*`       |
