## Local Installation

```sh
npm install -D @cspell/dict-hr-hr
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-hr-hr/cspell-ext.json"],
  "cSpell.language": "hr, hr-HR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-hr-hr/cspell-ext.json"],
  "language": "hr, hr-HR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-hr-hr/cspell-ext.json'
language: hr, hr-HR
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-hr-hr@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "hr, hr-HR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-hr-hr@latest/cspell-ext.json/cspell-ext.json"],
  "language": "hr, hr-HR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-hr-hr@latest/cspell-ext.json/cspell-ext.json
language: hr, hr-HR
```

</details>
