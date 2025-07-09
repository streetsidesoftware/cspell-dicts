## Local Installation

```sh
npm install -D @cspell/dict-grc
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-grc/cspell-ext.json"],
  "cSpell.language": "el-GRC, gr, grc, grc_GR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-grc/cspell-ext.json"],
  "language": "el-GRC, gr, grc, grc_GR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-grc/cspell-ext.json'
language: el-GRC, gr, grc, grc_GR
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-grc@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "el-GRC, gr, grc, grc_GR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-grc@latest/cspell-ext.json/cspell-ext.json"],
  "language": "el-GRC, gr, grc, grc_GR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-grc@latest/cspell-ext.json/cspell-ext.json
language: el-GRC, gr, grc, grc_GR
```

</details>
