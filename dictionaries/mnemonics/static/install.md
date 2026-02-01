## Local Installation

```sh
npm install -D @cspell/dict-mnemonics
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-mnemonics/cspell-ext.json"],
  "cSpell.dictionaries": ["mnemonics"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-mnemonics/cspell-ext.json"],
  "dictionaries": ["mnemonics"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-mnemonics/cspell-ext.json'
dictionaries:
  - mnemonics
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mnemonics@3/cspell-ext.json"],
  "cSpell.dictionaries": ["mnemonics"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mnemonics@3/cspell-ext.json"],
  "dictionaries": ["mnemonics"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-mnemonics@3/cspell-ext.json
dictionaries:
  - mnemonics
```

</details>

## Dictionary Information

| Name        | Enabled | Description                         |
| ----------- | ------- | ----------------------------------- |
| `mnemonics` |         | i86 Mnemonics dictionary for cspell |

## Language Settings

| Name        | Locale | File Type              |
| ----------- | ------ | ---------------------- |
| `mnemonics` |        | `c`, `cpp`, `h`, `hpp` |
