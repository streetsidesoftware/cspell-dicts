## Local Installation

```sh
npm install -D @cspell/dict-vim
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-vim/cspell-ext.json"],
  "cSpell.dictionaries": ["vim"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-vim/cspell-ext.json"],
  "dictionaries": ["vim"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-vim/cspell-ext.json'
dictionaries:
  - vim
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-vim@1/cspell-ext.json"],
  "cSpell.dictionaries": ["vim"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-vim@1/cspell-ext.json"],
  "dictionaries": ["vim"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-vim@1/cspell-ext.json
dictionaries:
  - vim
```

</details>

## Dictionary Information

| Name  | Enabled | Description     |
| ----- | ------- | --------------- |
| `vim` |         | Vim dictionary. |
