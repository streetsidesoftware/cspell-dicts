## Local Installation

```sh
npm install -D @cspell/dict-ru_ru
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-ru_ru/cspell-ext.json"],
  "cSpell.language": "ru, ru-ru",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-ru_ru/cspell-ext.json"],
  "language": "ru, ru-ru",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-ru_ru/cspell-ext.json'
language: ru, ru-ru
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ru_ru@2/cspell-ext.json"],
  "cSpell.language": "ru, ru-ru",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ru_ru@2/cspell-ext.json"],
  "language": "ru, ru-ru",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-ru_ru@2/cspell-ext.json
language: ru, ru-ru
```

</details>

## Dictionary Information

| Name    | Enabled | Description                   |
| ------- | ------- | ----------------------------- |
| `ru-ru` |         | Russian Dictionary (Combined) |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `ru-ru` | `ru`, `ru-ru` | `*`       |
