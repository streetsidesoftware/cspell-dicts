
## Local Installation

```sh
npm install -D @cspell/dict-uk-ua
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-uk-ua/cspell-ext.json"
  ],
  "cSpell.language": "uk"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-uk-ua/cspell-ext.json"
  ],
  "language": "uk"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-uk-ua/cspell-ext.json"
language: uk
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-uk-ua@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "uk"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-uk-ua@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "uk"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-uk-ua@latest/cspell-ext.json/cspell-ext.json
language: uk
```

</details>


