## Local Installation

```sh
npm install -D @cspell/dict-clojure
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-clojure/cspell-ext.json"],
  "cSpell.dictionaries": ["clojure"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-clojure/cspell-ext.json"],
  "dictionaries": ["clojure"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-clojure/cspell-ext.json'
dictionaries:
  - clojure
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-clojure@2/cspell-ext.json"],
  "cSpell.dictionaries": ["clojure"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-clojure@2/cspell-ext.json"],
  "dictionaries": ["clojure"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-clojure@2/cspell-ext.json
dictionaries:
  - clojure
```

</details>

## Dictionary Information

| Name      | Enabled | Description         |
| --------- | ------- | ------------------- |
| `clojure` |         | Clojure dictionary. |

## Language Settings

| Name      | Locale | File Type |
| --------- | ------ | --------- |
| `clojure` | `*`    | `clojure` |
