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
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-mnemonics/cspell-ext.json"],
  "dictionaries": ["mnemonics"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-mnemonics/cspell-ext.json'
dictionaries:
  - mnemonics
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mnemonics@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.dictionaries": ["mnemonics"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mnemonics@latest/cspell-ext.json/cspell-ext.json"],
  "dictionaries": ["mnemonics"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-mnemonics@latest/cspell-ext.json/cspell-ext.json
dictionaries:
  - mnemonics
```

</details>
