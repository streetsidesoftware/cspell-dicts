## Local Installation

```sh
npm install -D @cspell/dict-it-it
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-it-it/cspell-ext.json"],
  "cSpell.language": "it, it-IT",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-it-it/cspell-ext.json"],
  "language": "it, it-IT",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-it-it/cspell-ext.json'
language: it, it-IT
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-it-it@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "it, it-IT",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-it-it@latest/cspell-ext.json/cspell-ext.json"],
  "language": "it, it-IT",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-it-it@latest/cspell-ext.json/cspell-ext.json
language: it, it-IT
```

</details>
