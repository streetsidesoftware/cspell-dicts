
## Local Installation

```sh
npm install -D @cspell/dict-en-au
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-en-au/cspell-ext.json"
  ],
  "cSpell.language": "en-AU"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-en-au/cspell-ext.json"
  ],
  "language": "en-AU"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-en-au/cspell-ext.json"
language: en-AU
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-en-au@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "en-AU"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-en-au@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "en-AU"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-en-au@latest/cspell-ext.json/cspell-ext.json
language: en-AU
```

</details>


