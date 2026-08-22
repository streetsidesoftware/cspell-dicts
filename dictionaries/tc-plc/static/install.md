## Local Installation

```sh
npm install -D @cspell/dict-tc-plc
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-tc-plc/cspell-ext.json"],
  "cSpell.dictionaries": ["tc-plc"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-tc-plc/cspell-ext.json"],
  "dictionaries": ["tc-plc"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-tc-plc/cspell-ext.json'
dictionaries:
  - tc-plc
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-tc-plc@1/cspell-ext.json"],
  "cSpell.dictionaries": ["tc-plc"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-tc-plc@1/cspell-ext.json"],
  "dictionaries": ["tc-plc"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-tc-plc@1/cspell-ext.json
dictionaries:
  - tc-plc
```

</details>

## Dictionary Information

| Name     | Enabled | Description                                           |
| -------- | ------- | ----------------------------------------------------- |
| `tc-plc` |         | TwinCat PLC IEC61131 Structured Text (ST) dictionary. |

## Language Settings

| Name     | Locale | File Type |
| -------- | ------ | --------- |
| `tc-plc` | `*`    | `tc-plc`  |
