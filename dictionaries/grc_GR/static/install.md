## Local Installation

```sh
npm install -D @cspell/dict-grc
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-grc/cspell-ext.json"],
  "cSpell.language": "el-GRC, gr, grc, grc_GR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-grc/cspell-ext.json"],
  "language": "el-GRC, gr, grc, grc_GR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-grc/cspell-ext.json'
language: el-GRC, gr, grc, grc_GR
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-grc@1/cspell-ext.json"],
  "cSpell.language": "el-GRC, gr, grc, grc_GR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-grc@1/cspell-ext.json"],
  "language": "el-GRC, gr, grc, grc_GR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-grc@1/cspell-ext.json
language: el-GRC, gr, grc, grc_GR
```

</details>

## Dictionary Information

| Name  | Enabled | Description               |
| ----- | ------- | ------------------------- |
| `grc` |         | Ancient Greek dictionary. |

## Language Settings

| Name  | Locale                          | File Type |
| ----- | ------------------------------- | --------- |
| `grc` | `grc`, `grc_GR`, `gr`, `el-GRC` | `*`       |
