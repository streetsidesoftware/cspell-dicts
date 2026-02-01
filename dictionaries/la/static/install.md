## Local Installation

```sh
npm install -D @cspell/dict-la
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-la/cspell-ext.json"],
  "cSpell.language": "la, la-VA",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-la/cspell-ext.json"],
  "language": "la, la-VA",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-la/cspell-ext.json'
language: la, la-VA
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-la@1/cspell-ext.json"],
  "cSpell.language": "la, la-VA",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-la@1/cspell-ext.json"],
  "language": "la, la-VA",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-la@1/cspell-ext.json
language: la, la-VA
```

</details>

## Dictionary Information

| Name | Enabled | Description       |
| ---- | ------- | ----------------- |
| `la` |         | Latin dictionary. |

## Language Settings

| Name | Locale        | File Type |
| ---- | ------------- | --------- |
| `la` | `la`, `la-VA` | `*`       |
