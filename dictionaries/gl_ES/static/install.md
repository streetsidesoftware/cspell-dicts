
## Local Installation

```sh
npm install -D @cspell/dict-gl-es
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-gl-es/cspell-ext.json"
  ],
  "cSpell.language": "gl, gl_ES"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-gl-es/cspell-ext.json"
  ],
  "language": "gl, gl_ES"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-gl-es/cspell-ext.json"
language: gl, gl_ES
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-gl-es@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "gl, gl_ES"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-gl-es@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "gl, gl_ES"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-gl-es@latest/cspell-ext.json/cspell-ext.json
language: gl, gl_ES
```

</details>


