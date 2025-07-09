
## Local Installation

```sh
npm install -D @cspell/dict-hu-hu
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-hu-hu/cspell-ext.json"
  ],
  "cSpell.language": "hu, hu-hu"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-hu-hu/cspell-ext.json"
  ],
  "language": "hu, hu-hu"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-hu-hu/cspell-ext.json"
language: hu, hu-hu
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-hu-hu@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "hu, hu-hu"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-hu-hu@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "hu, hu-hu"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-hu-hu@latest/cspell-ext.json/cspell-ext.json
language: hu, hu-hu
```

</details>


