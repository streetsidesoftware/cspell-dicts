## Local Installation

```sh
npm install -D @cspell/dict-mk
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-mk/cspell-ext.json"],
  "cSpell.language": "mk, mk-cyrl",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-mk/cspell-ext.json"],
  "language": "mk, mk-cyrl",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-mk/cspell-ext.json'
language: mk, mk-cyrl
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mk@1/cspell-ext.json"],
  "cSpell.language": "mk, mk-cyrl",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mk@1/cspell-ext.json"],
  "language": "mk, mk-cyrl",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-mk@1/cspell-ext.json
language: mk, mk-cyrl
```

</details>

## Dictionary Information

| Name | Enabled | Description            |
| ---- | ------- | ---------------------- |
| `mk` |         | Macedonian dictionary. |

## Language Settings

| Name | Locale          | File Type |
| ---- | --------------- | --------- |
| `mk` | `mk`, `mk-cyrl` | `*`       |
