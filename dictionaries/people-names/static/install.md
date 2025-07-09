## Local Installation

```sh
npm install -D @cspell/dict-people-names
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-people-names/cspell-ext.json"],
  "cSpell.dictionaries": ["people-names"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-people-names/cspell-ext.json"],
  "dictionaries": ["people-names"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-people-names/cspell-ext.json'
dictionaries:
  - people-names
```

</details>

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-people-names@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.dictionaries": ["people-names"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.json`</summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-people-names@latest/cspell-ext.json/cspell-ext.json"],
  "dictionaries": ["people-names"],
}
```

</details>

<details>
<summary>CSpell Settings `cspell.config.yaml`</summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-people-names@latest/cspell-ext.json/cspell-ext.json
dictionaries:
  - people-names
```

</details>
