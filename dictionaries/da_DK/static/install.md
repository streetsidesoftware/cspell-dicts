
## Local Installation

```sh
npm install -D @cspell/dict-da-dk
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-da-dk/cspell-ext.json"
  ],
  "cSpell.language": "da, da-DK"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-da-dk/cspell-ext.json"
  ],
  "language": "da, da-DK"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-da-dk/cspell-ext.json"
language: da, da-DK
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-da-dk@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "da, da-DK"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-da-dk@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "da, da-DK"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-da-dk@latest/cspell-ext.json/cspell-ext.json
language: da, da-DK
```

</details>


