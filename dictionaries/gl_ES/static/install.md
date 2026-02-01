## Local Installation

```sh
npm install -D @cspell/dict-gl-es
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-gl-es/cspell-ext.json"],
  "cSpell.language": "gl, gl_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-gl-es/cspell-ext.json"],
  "language": "gl, gl_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-gl-es/cspell-ext.json'
language: gl, gl_ES
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gl-es@1/cspell-ext.json"],
  "cSpell.language": "gl, gl_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gl-es@1/cspell-ext.json"],
  "language": "gl, gl_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-gl-es@1/cspell-ext.json
language: gl, gl_ES
```

</details>

## Dictionary Information

| Name    | Enabled | Description                 |
| ------- | ------- | --------------------------- |
| `gl-es` |         | Galician Dictionary (Spain) |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `gl-es` | `gl`, `gl_ES` | `*`       |
