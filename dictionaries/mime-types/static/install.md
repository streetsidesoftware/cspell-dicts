## Local Installation

```sh
npm install -D @cspell/dict-mime-types
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-mime-types/cspell-ext.json"],
  "cSpell.dictionaries": ["mime-types"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-mime-types/cspell-ext.json"],
  "dictionaries": ["mime-types"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-mime-types/cspell-ext.json'
dictionaries:
  - mime-types
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mime-types@1/cspell-ext.json"],
  "cSpell.dictionaries": ["mime-types"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-mime-types@1/cspell-ext.json"],
  "dictionaries": ["mime-types"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-mime-types@1/cspell-ext.json
dictionaries:
  - mime-types
```

</details>

## Dictionary Information

| Name         | Enabled | Description            |
| ------------ | ------- | ---------------------- |
| `mime-types` |         | MIME Types dictionary. |
