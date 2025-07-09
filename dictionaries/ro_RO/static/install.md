
## Local Installation

```sh
npm install -D @cspell/dict-ro-ro
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-ro-ro/cspell-ext.json"
  ],
  "cSpell.language": "ro, ro-RO"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-ro-ro/cspell-ext.json"
  ],
  "language": "ro, ro-RO"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-ro-ro/cspell-ext.json"
language: ro, ro-RO
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-ro-ro@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "ro, ro-RO"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-ro-ro@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "ro, ro-RO"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-ro-ro@latest/cspell-ext.json/cspell-ext.json
language: ro, ro-RO
```

</details>


