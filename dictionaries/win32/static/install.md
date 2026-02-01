## Local Installation

```sh
npm install -D @cspell/dict-win32
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-win32/cspell-ext.json"],
  "cSpell.dictionaries": ["win32"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-win32/cspell-ext.json"],
  "dictionaries": ["win32"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-win32/cspell-ext.json'
dictionaries:
  - win32
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-win32@2/cspell-ext.json"],
  "cSpell.dictionaries": ["win32"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-win32@2/cspell-ext.json"],
  "dictionaries": ["win32"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-win32@2/cspell-ext.json
dictionaries:
  - win32
```

</details>

## Dictionary Information

| Name    | Enabled | Description       |
| ------- | ------- | ----------------- |
| `win32` |         | Win32 dictionary. |

## Language Settings

| Name    | Locale | File Type  |
| ------- | ------ | ---------- |
| `win32` | `*`    | `c`, `cpp` |
