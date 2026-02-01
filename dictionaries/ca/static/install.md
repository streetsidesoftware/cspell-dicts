## Local Installation

```sh
npm install -D @cspell/dict-ca
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-ca/cspell-ext.json"],
  "cSpell.language": "ca",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-ca/cspell-ext.json"],
  "language": "ca",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-ca/cspell-ext.json'
language: ca
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ca@3/cspell-ext.json"],
  "cSpell.language": "ca",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-ca@3/cspell-ext.json"],
  "language": "ca",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-ca@3/cspell-ext.json
language: ca
```

</details>

## Dictionary Information

| Name | Enabled | Description         |
| ---- | ------- | ------------------- |
| `ca` |         | Catalan dictionary. |

## Language Settings

| Name | Locale | File Type |
| ---- | ------ | --------- |
| `ca` | `ca`   | `*`       |
