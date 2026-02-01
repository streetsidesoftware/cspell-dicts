## Local Installation

```sh
npm install -D @cspell/dict-vi-vn
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-vi-vn/cspell-ext.json"],
  "cSpell.language": "vi",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-vi-vn/cspell-ext.json"],
  "language": "vi",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-vi-vn/cspell-ext.json'
language: vi
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-vi-vn@3/cspell-ext.json"],
  "cSpell.language": "vi",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-vi-vn@3/cspell-ext.json"],
  "language": "vi",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-vi-vn@3/cspell-ext.json
language: vi
```

</details>

## Dictionary Information

| Name    | Enabled | Description            |
| ------- | ------- | ---------------------- |
| `vi-vn` |         | Vietnamese dictionary. |

## Language Settings

| Name    | Locale | File Type |
| ------- | ------ | --------- |
| `vi-vn` | `vi`   | `*`       |
