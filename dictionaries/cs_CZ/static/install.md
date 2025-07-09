## Local Installation

```sh
npm install -D @cspell/dict-cs-cz
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-cs-cz/cspell-ext.json"],
  "cSpell.language": "cs",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-cs-cz/cspell-ext.json"],
  "language": "cs",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-cs-cz/cspell-ext.json'
language: cs
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-cs-cz@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "cs",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-cs-cz@latest/cspell-ext.json/cspell-ext.json"],
  "language": "cs",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-cs-cz@latest/cspell-ext.json/cspell-ext.json
language: cs
```

</details>
