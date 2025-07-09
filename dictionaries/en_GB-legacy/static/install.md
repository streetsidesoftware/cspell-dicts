## Local Installation

```sh
npm install -D @cspell/dict-en-gb-legacy
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-en-gb-legacy/cspell-ext.json"],
  "cSpell.language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-en-gb-legacy/cspell-ext.json"],
  "language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-en-gb-legacy/cspell-ext.json'
language: en-GB
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-gb-legacy@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-gb-legacy@latest/cspell-ext.json/cspell-ext.json"],
  "language": "en-GB",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-en-gb-legacy@latest/cspell-ext.json/cspell-ext.json
language: en-GB
```

</details>
