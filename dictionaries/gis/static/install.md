## Local Installation

```sh
npm install -D @cspell/dict-gis
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-gis/cspell-ext.json"],
  "cSpell.dictionaries": ["gis"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-gis/cspell-ext.json"],
  "dictionaries": ["gis"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-gis/cspell-ext.json'
dictionaries:
  - gis
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gis@latest/cspell-ext.json/cspell-ext.json"],
  "cSpell.dictionaries": ["gis"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gis@latest/cspell-ext.json/cspell-ext.json"],
  "dictionaries": ["gis"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-gis@latest/cspell-ext.json/cspell-ext.json
dictionaries:
  - gis
```

</details>

## Dictionary Information

| Name  | Enabled | Description                 |
| ----- | ------- | --------------------------- |
| `gis` |         | GIS and PostGIS dictionary. |
