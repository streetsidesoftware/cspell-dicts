## Local Installation

```sh
npm install -D @cspell/dict-cspell-bundle
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-cspell-bundle/cspell-ext.json"],
  "cSpell.dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-cspell-bundle/cspell-ext.json"],
  "dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-cspell-bundle/cspell-ext.json'
dictionaries: []
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-cspell-bundle@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-cspell-bundle@latest/cspell-ext.json/cspell-ext.json"],
  "dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-cspell-bundle@latest/cspell-ext.json/cspell-ext.json
dictionaries: []
```

</details>
