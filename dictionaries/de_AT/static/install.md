## Local Installation

```sh
npm install -D @cspell/dict-de-at
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-de-at/cspell-ext.json"],
  "cSpell.language": "de_AT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-de-at/cspell-ext.json"],
  "language": "de_AT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-de-at/cspell-ext.json'
language: de_AT
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-de-at@1/cspell-ext.json"],
  "cSpell.language": "de_AT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-de-at@1/cspell-ext.json"],
  "language": "de_AT",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-de-at@1/cspell-ext.json
language: de_AT
```

</details>

## Dictionary Information

| Name    | Enabled | Description                         |
| ------- | ------- | ----------------------------------- |
| `de-at` |         | Austrian German (de-AT) Dictionary. |

## Language Settings

| Name    | Locale  | File Type |
| ------- | ------- | --------- |
| `de-at` | `de_AT` | `*`       |
