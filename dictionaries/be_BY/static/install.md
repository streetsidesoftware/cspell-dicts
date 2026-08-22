## Local Installation

```sh
npm install -D @cspell/dict-be-by
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-be-by/cspell-ext.json"],
  "cSpell.language": "be, be-BY",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-be-by/cspell-ext.json"],
  "language": "be, be-BY",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-be-by/cspell-ext.json'
language: be, be-BY
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-be-by@1/cspell-ext.json"],
  "cSpell.language": "be, be-BY",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-be-by@1/cspell-ext.json"],
  "language": "be, be-BY",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-be-by@1/cspell-ext.json
language: be, be-BY
```

</details>

## Dictionary Information

| Name    | Enabled | Description                       |
| ------- | ------- | --------------------------------- |
| `be-by` |         | Belarusian dictionary for cspell. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `be-by` | `be`, `be-BY` | `*`       |
