
## Local Installation

```sh
npm install -D @cspell/dict-bg-bg
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-bg-bg/cspell-ext.json"
  ],
  "cSpell.language": "bg, bg-BG"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-bg-bg/cspell-ext.json"
  ],
  "language": "bg, bg-BG"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-bg-bg/cspell-ext.json"
language: bg, bg-BG
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-bg-bg@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "bg, bg-BG"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-bg-bg@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "bg, bg-BG"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-bg-bg@latest/cspell-ext.json/cspell-ext.json
language: bg, bg-BG
```

</details>


