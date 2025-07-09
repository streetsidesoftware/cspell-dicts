
## Local Installation

```sh
npm install -D @cspell/dict-tr-tr
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-tr-tr/cspell-ext.json"
  ],
  "cSpell.language": "tr, tr-TR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-tr-tr/cspell-ext.json"
  ],
  "language": "tr, tr-TR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-tr-tr/cspell-ext.json"
language: tr, tr-TR
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-tr-tr@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "tr, tr-TR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-tr-tr@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "tr, tr-TR"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-tr-tr@latest/cspell-ext.json/cspell-ext.json
language: tr, tr-TR
```

</details>


