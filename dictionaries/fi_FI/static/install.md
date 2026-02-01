## Local Installation

```sh
npm install -D @cspell/dict-fi-fi
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-fi-fi/cspell-ext.json"],
  "cSpell.language": "fi, fi-fi",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-fi-fi/cspell-ext.json"],
  "language": "fi, fi-fi",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-fi-fi/cspell-ext.json'
language: fi, fi-fi
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fi-fi@1/cspell-ext.json"],
  "cSpell.language": "fi, fi-fi",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fi-fi@1/cspell-ext.json"],
  "language": "fi, fi-fi",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-fi-fi@1/cspell-ext.json
language: fi, fi-fi
```

</details>

## Dictionary Information

| Name    | Enabled | Description         |
| ------- | ------- | ------------------- |
| `fi-fi` |         | Finnish dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `fi-fi` | `fi`, `fi-fi` | `*`       |
