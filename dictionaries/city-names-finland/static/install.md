## Local Installation

```sh
npm install -D @cspell/dict-city-names-finland
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-city-names-finland/cspell-ext.json"],
  "cSpell.dictionaries": ["city-names-finland"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-city-names-finland/cspell-ext.json"],
  "dictionaries": ["city-names-finland"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-city-names-finland/cspell-ext.json'
dictionaries:
  - city-names-finland
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-city-names-finland@3/cspell-ext.json"],
  "cSpell.dictionaries": ["city-names-finland"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-city-names-finland@3/cspell-ext.json"],
  "dictionaries": ["city-names-finland"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-city-names-finland@3/cspell-ext.json
dictionaries:
  - city-names-finland
```

</details>

## Dictionary Information

| Name                 | Enabled | Description                |
| -------------------- | ------- | -------------------------- |
| `city-names-finland` | **Yes** | List of cities in Finland. |
