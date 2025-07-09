## Local Installation

```sh
npm install -D @cspell/dict-en-ca
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-en-ca/cspell-ext.json"],
  "cSpell.language": "en-CA",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-en-ca/cspell-ext.json"],
  "language": "en-CA",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-en-ca/cspell-ext.json'
language: en-CA
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-ca@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "en-CA",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-ca@latest/cspell-ext.json/cspell-ext.json"],
  "language": "en-CA",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-en-ca@latest/cspell-ext.json/cspell-ext.json
language: en-CA
```

</details>
