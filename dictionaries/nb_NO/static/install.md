## Local Installation

```sh
npm install -D @cspell/dict-nb-no
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-nb-no/cspell-ext.json"],
  "cSpell.language": "nb, nb-no",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-nb-no/cspell-ext.json"],
  "language": "nb, nb-no",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-nb-no/cspell-ext.json'
language: nb, nb-no
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nb-no@2/cspell-ext.json"],
  "cSpell.language": "nb, nb-no",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nb-no@2/cspell-ext.json"],
  "language": "nb, nb-no",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-nb-no@2/cspell-ext.json
language: nb, nb-no
```

</details>

## Dictionary Information

| Name    | Enabled | Description                  |
| ------- | ------- | ---------------------------- |
| `nb-no` |         | Norwegian Bokmål dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `nb-no` | `nb`, `nb-no` | `*`       |
