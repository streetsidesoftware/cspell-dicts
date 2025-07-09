
## Local Installation

```sh
npm install -D @cspell/dict-fi-fi
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-fi-fi/cspell-ext.json"
  ],
  "cSpell.language": "fi, fi-fi"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-fi-fi/cspell-ext.json"
  ],
  "language": "fi, fi-fi"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-fi-fi/cspell-ext.json"
language: fi, fi-fi
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-fi-fi@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "fi, fi-fi"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-fi-fi@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "fi, fi-fi"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-fi-fi@latest/cspell-ext.json/cspell-ext.json
language: fi, fi-fi
```

</details>


