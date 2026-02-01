## Local Installation

```sh
npm install -D @cspell/dict-cs-cz
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-cs-cz/cspell-ext.json"],
  "cSpell.language": "cs",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-cs-cz/cspell-ext.json"],
  "language": "cs",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-cs-cz/cspell-ext.json'
language: cs
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-cs-cz@3/cspell-ext.json"],
  "cSpell.language": "cs",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-cs-cz@3/cspell-ext.json"],
  "language": "cs",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-cs-cz@3/cspell-ext.json
language: cs
```

</details>

## Dictionary Information

| Name    | Enabled | Description       |
| ------- | ------- | ----------------- |
| `cs-cz` |         | Czech dictionary. |

## Language Settings

| Name    | Locale | File Type |
| ------- | ------ | --------- |
| `cs-cz` | `cs`   | `*`       |
