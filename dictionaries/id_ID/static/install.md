## Local Installation

```sh
npm install -D @cspell/dict-id-id
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-id-id/cspell-ext.json"],
  "cSpell.language": "id, id-ID",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-id-id/cspell-ext.json"],
  "language": "id, id-ID",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-id-id/cspell-ext.json'
language: id, id-ID
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-id-id@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "id, id-ID",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-id-id@latest/cspell-ext.json/cspell-ext.json"],
  "language": "id, id-ID",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-id-id@latest/cspell-ext.json/cspell-ext.json
language: id, id-ID
```

</details>
