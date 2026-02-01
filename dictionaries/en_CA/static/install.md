## Local Installation

```sh
npm install -D @cspell/dict-en-ca
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-en-ca/cspell-ext.json"],
  "cSpell.language": "en-CA",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-en-ca/cspell-ext.json"],
  "language": "en-CA",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-en-ca/cspell-ext.json'
language: en-CA
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-ca@1/cspell-ext.json"],
  "cSpell.language": "en-CA",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-ca@1/cspell-ext.json"],
  "language": "en-CA",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-en-ca@1/cspell-ext.json
language: en-CA
```

</details>

## Dictionary Information

| Name                        | Enabled | Description                 |
| --------------------------- | ------- | --------------------------- |
| `en-ca`                     |         | Canadian English Dictionary |
| `en-common-misspellings`    |         | _External_                  |
| `en-gb-common-misspellings` |         | _External_                  |

## Language Settings

| Name                        | Locale  | File Type |
| --------------------------- | ------- | --------- |
| `en-ca`                     | `en-CA` | `*`       |
| `en-common-misspellings`    | `en-CA` | `*`       |
| `en-gb-common-misspellings` | `en-CA` | `*`       |
