
## Local Installation

```sh
npm install -D @cspell/dict-sv
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-sv/cspell-ext.json"
  ],
  "cSpell.language": "sv, sv_SE"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-sv/cspell-ext.json"
  ],
  "language": "sv, sv_SE"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-sv/cspell-ext.json"
language: sv, sv_SE
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-sv@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "sv, sv_SE"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-sv@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "sv, sv_SE"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-sv@latest/cspell-ext.json/cspell-ext.json
language: sv, sv_SE
```

</details>


