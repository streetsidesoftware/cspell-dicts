
## Local Installation

```sh
npm install -D @cspell/dict-fr-fr
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-fr-fr/cspell-ext.json"
  ],
  "cSpell.language": "fr, fr_FR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-fr-fr/cspell-ext.json"
  ],
  "language": "fr, fr_FR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-fr-fr/cspell-ext.json"
language: fr, fr_FR
```

</details>



## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-fr-fr@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "fr, fr_FR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-fr-fr@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "fr, fr_FR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-fr-fr@latest/cspell-ext.json/cspell-ext.json
language: fr, fr_FR
```

</details>


