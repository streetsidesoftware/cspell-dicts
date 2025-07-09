
## Local Installation

```sh
npm install -D @cspell/dict-pt-br
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-pt-br/cspell-ext.json"
  ],
  "cSpell.language": "pt, pt_BR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-pt-br/cspell-ext.json"
  ],
  "language": "pt, pt_BR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-pt-br/cspell-ext.json"
language: pt, pt_BR
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-pt-br@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "pt, pt_BR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-pt-br@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "pt, pt_BR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-pt-br@latest/cspell-ext.json/cspell-ext.json
language: pt, pt_BR
```

</details>


