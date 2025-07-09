
## Local Installation

```sh
npm install -D @cspell/dict-es-es
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-es-es/cspell-ext.json"
  ],
  "cSpell.language": "es, es_ES"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-es-es/cspell-ext.json"
  ],
  "language": "es, es_ES"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-es-es/cspell-ext.json"
language: es, es_ES
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-es-es@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "es, es_ES"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-es-es@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "es, es_ES"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-es-es@latest/cspell-ext.json/cspell-ext.json
language: es, es_ES
```

</details>


