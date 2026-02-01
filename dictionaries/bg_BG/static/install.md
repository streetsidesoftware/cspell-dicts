## Local Installation

```sh
npm install -D @cspell/dict-bg-bg
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-bg-bg/cspell-ext.json"],
  "cSpell.language": "bg, bg-BG",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-bg-bg/cspell-ext.json"],
  "language": "bg, bg-BG",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-bg-bg/cspell-ext.json'
language: bg, bg-BG
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-bg-bg@3/cspell-ext.json"],
  "cSpell.language": "bg, bg-BG",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-bg-bg@3/cspell-ext.json"],
  "language": "bg, bg-BG",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-bg-bg@3/cspell-ext.json
language: bg, bg-BG
```

</details>

## Dictionary Information

| Name    | Enabled | Description           |
| ------- | ------- | --------------------- |
| `bg-bg` |         | Bulgarian dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `bg-bg` | `bg`, `bg-BG` | `*`       |
