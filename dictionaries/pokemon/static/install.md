## Local Installation

```sh
npm install -D @cspell/dict-pokemon
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-pokemon/cspell-ext.json"],
  "cSpell.dictionaries": ["pokemon"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-pokemon/cspell-ext.json"],
  "dictionaries": ["pokemon"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-pokemon/cspell-ext.json'
dictionaries:
  - pokemon
```

</details>

## Local Installation using CDN

## CDN Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pokemon@1/cspell-ext.json"],
  "cSpell.dictionaries": ["pokemon"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-pokemon@1/cspell-ext.json"],
  "dictionaries": ["pokemon"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-pokemon@1/cspell-ext.json
dictionaries:
  - pokemon
```

</details>

## Dictionary Information

| Name      | Enabled | Description         |
| --------- | ------- | ------------------- |
| `pokemon` | **Yes** | Pokémon dictionary. |
