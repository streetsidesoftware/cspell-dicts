
## Local Installation

```sh
npm install -D @cspell/dict-redis
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-redis/cspell-ext.json"
  ],
  "cSpell.dictionaries": [
    "redis"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-redis/cspell-ext.json"
  ],
  "dictionaries": [
    "redis"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-redis/cspell-ext.json"
dictionaries:
  - redis
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-redis@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.dictionaries": [
    "redis"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-redis@latest/cspell-ext.json/cspell-ext.json"
  ],
  "dictionaries": [
    "redis"
  ]
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-redis@latest/cspell-ext.json/cspell-ext.json
dictionaries:
  - redis
```

</details>


