
## Local Installation

```sh
npm install -D @cspell/dict-de-at
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-de-at/cspell-ext.json"
  ],
  "cSpell.language": "de_AT"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-de-at/cspell-ext.json"
  ],
  "language": "de_AT"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-de-at/cspell-ext.json"
language: de_AT
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-de-at@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "de_AT"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-de-at@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "de_AT"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-de-at@latest/cspell-ext.json/cspell-ext.json
language: de_AT
```

</details>


