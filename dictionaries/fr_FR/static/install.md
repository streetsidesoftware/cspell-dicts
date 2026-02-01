## Local Installation

```sh
npm install -D @cspell/dict-fr-fr
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-fr-fr/cspell-ext.json"],
  "cSpell.language": "fr, fr_FR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-fr-fr/cspell-ext.json"],
  "language": "fr, fr_FR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-fr-fr/cspell-ext.json'
language: fr, fr_FR
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fr-fr@2/cspell-ext.json"],
  "cSpell.language": "fr, fr_FR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fr-fr@2/cspell-ext.json"],
  "language": "fr, fr_FR",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-fr-fr@2/cspell-ext.json
language: fr, fr_FR
```

</details>

## Dictionary Information

| Name    | Enabled | Description                |
| ------- | ------- | -------------------------- |
| `fr-fr` |         | French Dictionary (France) |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `fr-fr` | `fr`, `fr_FR` | `*`       |
