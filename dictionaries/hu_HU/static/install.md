## Local Installation

```sh
npm install -D @cspell/dict-hu-hu
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-hu-hu/cspell-ext.json"],
  "cSpell.language": "hu, hu-hu",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-hu-hu/cspell-ext.json"],
  "language": "hu, hu-hu",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-hu-hu/cspell-ext.json'
language: hu, hu-hu
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-hu-hu@1/cspell-ext.json"],
  "cSpell.language": "hu, hu-hu",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-hu-hu@1/cspell-ext.json"],
  "language": "hu, hu-hu",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-hu-hu@1/cspell-ext.json
language: hu, hu-hu
```

</details>

## Dictionary Information

| Name    | Enabled | Description           |
| ------- | ------- | --------------------- |
| `hu-hu` |         | Hungarian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `hu-hu` | `hu`, `hu-hu` | `*`       |
