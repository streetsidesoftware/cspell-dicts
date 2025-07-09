## Local Installation

```sh
npm install -D @cspell/dict-de-ch
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-de-ch/cspell-ext.json"],
  "cSpell.language": "de, de_CH",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-de-ch/cspell-ext.json"],
  "language": "de, de_CH",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-de-ch/cspell-ext.json'
language: de, de_CH
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-de-ch@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "de, de_CH",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-de-ch@latest/cspell-ext.json/cspell-ext.json"],
  "language": "de, de_CH",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-de-ch@latest/cspell-ext.json/cspell-ext.json
language: de, de_CH
```

</details>
