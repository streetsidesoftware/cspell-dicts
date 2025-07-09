
## Local Installation

```sh
npm install -D @cspell/dict-ru_ru
```


## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": [
    "@cspell/dict-ru_ru/cspell-ext.json"
  ],
  "cSpell.language": "ru, ru-ru"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "@cspell/dict-ru_ru/cspell-ext.json"
  ],
  "language": "ru, ru-ru"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - "@cspell/dict-ru_ru/cspell-ext.json"
language: ru, ru-ru
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
    "https://cdn.jsdelivr.net/npm/@cspell/dict-ru_ru@latest/cspell-ext.json/cspell-ext.json"
  ],
  "cSpell.language": "ru, ru-ru"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": [
    "https://cdn.jsdelivr.net/npm/@cspell/dict-ru_ru@latest/cspell-ext.json/cspell-ext.json"
  ],
  "language": "ru, ru-ru"
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-ru_ru@latest/cspell-ext.json/cspell-ext.json
language: ru, ru-ru
```

</details>


