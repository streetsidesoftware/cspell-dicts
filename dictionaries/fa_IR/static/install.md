## Local Installation

```sh
npm install -D @cspell/dict-fa-ir
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-fa-ir/cspell-ext.json"],
  "cSpell.language": "fa, fa-IR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-fa-ir/cspell-ext.json"],
  "language": "fa, fa-IR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-fa-ir/cspell-ext.json'
language: fa, fa-IR
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fa-ir@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "fa, fa-IR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fa-ir@latest/cspell-ext.json/cspell-ext.json"],
  "language": "fa, fa-IR",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-fa-ir@latest/cspell-ext.json/cspell-ext.json
language: fa, fa-IR
```

</details>
