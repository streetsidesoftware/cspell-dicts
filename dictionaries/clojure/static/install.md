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
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-clojure/cspell-ext.json"],
  "dictionaries": ["clojure"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-clojure/cspell-ext.json'
dictionaries:
  - clojure
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-clojure@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.dictionaries": ["clojure"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-clojure@latest/cspell-ext.json/cspell-ext.json"],
  "dictionaries": ["clojure"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-clojure@latest/cspell-ext.json/cspell-ext.json
dictionaries:
  - clojure
```

</details>
