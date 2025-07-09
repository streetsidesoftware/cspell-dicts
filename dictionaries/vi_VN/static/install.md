
## Local Installation

```sh
npm install -D @cspell/dict-vi-vn
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-vi-vn/cspell-ext.json"
  ],
  "cSpell.language": "vi"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-vi-vn/cspell-ext.json"
  ],
  "language": "vi"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-vi-vn/cspell-ext.json"
language: vi
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-vi-vn@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "vi"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-vi-vn@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "vi"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-vi-vn@latest/cspell-ext.json/cspell-ext.json
language: vi
```

</details>


