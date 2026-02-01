## Local Installation

```sh
npm install -D @cspell/dict-en-au
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-en-au/cspell-ext.json"],
  "cSpell.language": "en-AU",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-en-au/cspell-ext.json"],
  "language": "en-AU",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-en-au/cspell-ext.json'
language: en-AU
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-au@1/cspell-ext.json"],
  "cSpell.language": "en-AU",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-au@1/cspell-ext.json"],
  "language": "en-AU",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-en-au@1/cspell-ext.json
language: en-AU
```

</details>

## Dictionary Information

| Name                        | Enabled | Description                   |
| --------------------------- | ------- | ----------------------------- |
| `en-au`                     |         | Australian English Dictionary |
| `en-common-misspellings`    |         | _External_                    |
| `en-gb-common-misspellings` |         | _External_                    |

## Language Settings

| Name                        | Locale  | File Type |
| --------------------------- | ------- | --------- |
| `en-au`                     | `en-AU` | `*`       |
| `en-common-misspellings`    | `en-AU` | `*`       |
| `en-gb-common-misspellings` | `en-AU` | `*`       |
