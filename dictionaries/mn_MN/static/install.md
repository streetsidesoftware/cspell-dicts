## Local Installation

```sh
npm install -D @cspell/dict-mn-mn
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-mn-mn/cspell-ext.json"],
  "cSpell.language": "mn, mn-MN",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-mn-mn/cspell-ext.json"],
  "language": "mn, mn-MN",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-mn-mn/cspell-ext.json'
language: mn, mn-MN
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mn-mn@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "mn, mn-MN",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mn-mn@latest/cspell-ext.json/cspell-ext.json"],
  "language": "mn, mn-MN",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-mn-mn@latest/cspell-ext.json/cspell-ext.json
language: mn, mn-MN
```

</details>
