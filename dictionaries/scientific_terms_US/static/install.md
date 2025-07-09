
## Local Installation

```sh
npm install -D @cspell/dict-scientific-terms-us
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-scientific-terms-us/cspell-ext.json"
  ],
  "cSpell.dictionaries": [
    "scientific-terms-us"
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
    "@cspell/dict-scientific-terms-us/cspell-ext.json"
  ],
  "dictionaries": [
    "scientific-terms-us"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-scientific-terms-us/cspell-ext.json"
dictionaries:
  - scientific-terms-us
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-us@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.dictionaries": [
    "scientific-terms-us"
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-us@latest/cspell-ext.json/cspell-ext.json"
  ],
  "dictionaries": [
    "scientific-terms-us"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-us@latest/cspell-ext.json/cspell-ext.json
dictionaries:
  - scientific-terms-us
```

</details>


