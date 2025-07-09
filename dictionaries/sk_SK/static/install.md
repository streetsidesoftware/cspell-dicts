## Local Installation

```sh
npm install -D @cspell/dict-sk-sk
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-sk-sk/cspell-ext.json"],
  "cSpell.language": "sk",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-sk-sk/cspell-ext.json"],
  "language": "sk",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-sk-sk/cspell-ext.json'
language: sk
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sk-sk@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "sk",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sk-sk@latest/cspell-ext.json/cspell-ext.json"],
  "language": "sk",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-sk-sk@latest/cspell-ext.json/cspell-ext.json
language: sk
```

</details>
