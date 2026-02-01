## Local Installation

```sh
npm install -D @cspell/dict-en-shared
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-en-shared/cspell-ext.json"],
  "cSpell.language": "en",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-en-shared/cspell-ext.json"],
  "language": "en",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-en-shared/cspell-ext.json'
language: en
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-shared@1/cspell-ext.json"],
  "cSpell.language": "en",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-shared@1/cspell-ext.json"],
  "language": "en",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-en-shared@1/cspell-ext.json
language: en
```

</details>

## Dictionary Information

| Name        | Enabled | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| `en-shared` |         | English words shared between the various English dictionaries. |

## Language Settings

| Name        | Locale | File Type |
| ----------- | ------ | --------- |
| `en-shared` | `en`   | `*`       |
