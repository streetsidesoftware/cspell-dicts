## Local Installation

```sh
npm install -D @cspell/dict-et-ee
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-et-ee/cspell-ext.json"],
  "cSpell.language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-et-ee/cspell-ext.json"],
  "language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-et-ee/cspell-ext.json'
language: et, et-EE
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-et-ee@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-et-ee@latest/cspell-ext.json/cspell-ext.json"],
  "language": "et, et-EE",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-et-ee@latest/cspell-ext.json/cspell-ext.json
language: et, et-EE
```

</details>
