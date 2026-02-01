## Local Installation

```sh
npm install -D @cspell/dict-pl_pl
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-pl_pl/cspell-ext.json"],
  "cSpell.language": "pl, pl_PL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-pl_pl/cspell-ext.json"],
  "language": "pl, pl_PL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-pl_pl/cspell-ext.json'
language: pl, pl_PL
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pl_pl@3/cspell-ext.json"],
  "cSpell.language": "pl, pl_PL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pl_pl@3/cspell-ext.json"],
  "language": "pl, pl_PL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-pl_pl@3/cspell-ext.json
language: pl, pl_PL
```

</details>

## Dictionary Information

| Name    | Enabled | Description       |
| ------- | ------- | ----------------- |
| `pl-pl` |         | Polish Dictionary |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `pl-pl` | `pl`, `pl_PL` | `*`       |
