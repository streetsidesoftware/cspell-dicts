## Local Installation

```sh
npm install -D @cspell/dict-en-slang
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-en-slang/cspell-ext.json"],
  "cSpell.dictionaries": ["en-slang"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-en-slang/cspell-ext.json"],
  "dictionaries": ["en-slang"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-en-slang/cspell-ext.json'
dictionaries:
  - en-slang
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-slang@1/cspell-ext.json"],
  "cSpell.dictionaries": ["en-slang"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-slang@1/cspell-ext.json"],
  "dictionaries": ["en-slang"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-en-slang@1/cspell-ext.json
dictionaries:
  - en-slang
```

</details>

## Dictionary Information

| Name       | Enabled | Description                            |
| ---------- | ------- | -------------------------------------- |
| `en-slang` |         | Modern English slang words dictionary. |
