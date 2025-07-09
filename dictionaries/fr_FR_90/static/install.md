## Local Installation

```sh
npm install -D @cspell/dict-fr-reforme
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-fr-reforme/cspell-ext.json"],
  "cSpell.language": "fr, fr-90, fr-fr",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-fr-reforme/cspell-ext.json"],
  "language": "fr, fr-90, fr-fr",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-fr-reforme/cspell-ext.json'
language: fr, fr-90, fr-fr
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fr-reforme@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.language": "fr, fr-90, fr-fr",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fr-reforme@latest/cspell-ext.json/cspell-ext.json"],
  "language": "fr, fr-90, fr-fr",
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-fr-reforme@latest/cspell-ext.json/cspell-ext.json
language: fr, fr-90, fr-fr
```

</details>
