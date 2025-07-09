## Local Installation

```sh
npm install -D @cspell/dict-pokemon
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-pokemon/cspell-ext.json"],
  "cSpell.dictionaries": ["pokemon"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-pokemon/cspell-ext.json"],
  "dictionaries": ["pokemon"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-pokemon/cspell-ext.json'
dictionaries:
  - pokemon
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pokemon@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.dictionaries": ["pokemon"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pokemon@latest/cspell-ext.json/cspell-ext.json"],
  "dictionaries": ["pokemon"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-pokemon@latest/cspell-ext.json/cspell-ext.json
dictionaries:
  - pokemon
```

</details>
