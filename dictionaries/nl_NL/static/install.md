
## Local Installation

```sh
npm install -D @cspell/dict-nl-nl
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-nl-nl/cspell-ext.json"
  ],
  "cSpell.language": "nl, nl-NL"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-nl-nl/cspell-ext.json"
  ],
  "language": "nl, nl-NL"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-nl-nl/cspell-ext.json"
language: nl, nl-NL
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-nl-nl@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "nl, nl-NL"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-nl-nl@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "nl, nl-NL"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-nl-nl@latest/cspell-ext.json/cspell-ext.json
language: nl, nl-NL
```

</details>


