## Local Installation

```sh
npm install -D @cspell/dict-scientific-terms-gb
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-scientific-terms-gb/cspell-ext.json"],
  "cSpell.language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-scientific-terms-gb/cspell-ext.json"],
  "language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-scientific-terms-gb/cspell-ext.json'
language: en-GB
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-gb@1/cspell-ext.json"],
  "cSpell.language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-gb@1/cspell-ext.json"],
  "language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-gb@1/cspell-ext.json
language: en-GB
```

</details>

## Dictionary Information

| Name                  | Enabled | Description                     |
| --------------------- | ------- | ------------------------------- |
| `scientific-terms-gb` |         | Scientific Terms GB dictionary. |

## Language Settings

| Name                  | Locale  | File Type |
| --------------------- | ------- | --------- |
| `scientific-terms-gb` | `en-GB` | `*`       |
