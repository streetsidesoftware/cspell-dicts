## Local Installation

```sh
npm install -D @cspell/dict-hy
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-hy/cspell-ext.json"],
  "cSpell.language": "hy, hy-AM",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-hy/cspell-ext.json"],
  "language": "hy, hy-AM",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-hy/cspell-ext.json'
language: hy, hy-AM
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-hy@1/cspell-ext.json"],
  "cSpell.language": "hy, hy-AM",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-hy@1/cspell-ext.json"],
  "language": "hy, hy-AM",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-hy@1/cspell-ext.json
language: hy, hy-AM
```

</details>

## Dictionary Information

| Name    | Enabled | Description         |
| ------- | ------- | ------------------- |
| `hy_am` |         | Armenian dictionary |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `hy_am` | `hy`, `hy-AM` | `*`       |
