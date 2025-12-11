## Local Installation

```sh
npm install -D @cspell/dict-gdscript
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-gdscript/cspell-ext.json"],
  "cSpell.dictionaries": ["gdscript"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-gdscript/cspell-ext.json"],
  "dictionaries": ["gdscript"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-gdscript/cspell-ext.json'
dictionaries:
  - gdscript
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gdscript/cspell-ext.json"],
  "cSpell.dictionaries": ["gdscript"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gdscript/cspell-ext.json"],
  "dictionaries": ["gdscript"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-gdscript/cspell-ext.json
dictionaries:
  - gdscript
```

</details>

## Dictionary Information

| Name       | Enabled | Description                     |
| ---------- | ------- | ------------------------------- |
| `gdscript` |         | GDScript dictionary for cspell. |

## Language Settings

| Name       | Locale | File Type  |
| ---------- | ------ | ---------- |
| `gdscript` | `*`    | `gdscript` |
