## Local Installation

```sh
npm install -D @cspell/dict-elisp
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-elisp/cspell-ext.json"],
  "cSpell.dictionaries": ["elisp"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-elisp/cspell-ext.json"],
  "dictionaries": ["elisp"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-elisp/cspell-ext.json'
dictionaries:
  - elisp
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-elisp@1/cspell-ext.json"],
  "cSpell.dictionaries": ["elisp"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-elisp@1/cspell-ext.json"],
  "dictionaries": ["elisp"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-elisp@1/cspell-ext.json
dictionaries:
  - elisp
```

</details>

## Dictionary Information

| Name    | Enabled | Description            |
| ------- | ------- | ---------------------- |
| `elisp` |         | Emacs Lisp dictionary. |

## Language Settings

| Name    | Locale | File Type       |
| ------- | ------ | --------------- |
| `elisp` | `*`    | `elisp`, `lisp` |
