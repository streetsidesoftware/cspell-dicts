
## Local Installation

```sh
npm install -D @cspell/dict-nb-no
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-nb-no/cspell-ext.json"
  ],
  "cSpell.language": "nb, nb-no"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-nb-no/cspell-ext.json"
  ],
  "language": "nb, nb-no"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-nb-no/cspell-ext.json"
language: nb, nb-no
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-nb-no@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "nb, nb-no"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-nb-no@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "nb, nb-no"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-nb-no@latest/cspell-ext.json/cspell-ext.json
language: nb, nb-no
```

</details>


