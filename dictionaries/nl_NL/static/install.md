## Local Installation

```sh
npm install -D @cspell/dict-nl-nl
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-nl-nl/cspell-ext.json"],
  "cSpell.language": "nl, nl-NL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-nl-nl/cspell-ext.json"],
  "language": "nl, nl-NL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-nl-nl/cspell-ext.json'
language: nl, nl-NL
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nl-nl@2/cspell-ext.json"],
  "cSpell.language": "nl, nl-NL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nl-nl@2/cspell-ext.json"],
  "language": "nl, nl-NL",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-nl-nl@2/cspell-ext.json
language: nl, nl-NL
```

</details>

## Dictionary Information

| Name    | Enabled | Description                    |
| ------- | ------- | ------------------------------ |
| `nl-nl` |         | Dutch (Netherlands) Dictionary |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `nl-nl` | `nl`, `nl-NL` | `*`       |
