
## Local Installation

```sh
npm install -D @cspell/dict-win32
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-win32/cspell-ext.json"
  ],
  "cSpell.dictionaries": [
    "win32"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-win32/cspell-ext.json"
  ],
  "dictionaries": [
    "win32"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-win32/cspell-ext.json"
dictionaries:
  - win32
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-win32@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.dictionaries": [
    "win32"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-win32@latest/cspell-ext.json/cspell-ext.json"
  ],
  "dictionaries": [
    "win32"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-win32@latest/cspell-ext.json/cspell-ext.json
dictionaries:
  - win32
```

</details>


