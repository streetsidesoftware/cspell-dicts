## Local Installation

```sh
npm install -D @cspell/dict-sr-cyrl
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-sr-cyrl/cspell-ext.json"],
  "cSpell.language": "sr, sr-Cyrl",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-sr-cyrl/cspell-ext.json"],
  "language": "sr, sr-Cyrl",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-sr-cyrl/cspell-ext.json'
language: sr, sr-Cyrl
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sr-cyrl@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "sr, sr-Cyrl",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-sr-cyrl@latest/cspell-ext.json/cspell-ext.json"],
  "language": "sr, sr-Cyrl",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-sr-cyrl@latest/cspell-ext.json/cspell-ext.json
language: sr, sr-Cyrl
```

</details>
