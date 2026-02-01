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
  "cSpell.import": ["@cspell/dict-redis/cspell-ext.json"],
  "cSpell.dictionaries": ["redis"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-redis/cspell-ext.json"],
  "dictionaries": ["redis"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-redis/cspell-ext.json'
dictionaries:
  - redis
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-redis@1/cspell-ext.json"],
  "cSpell.dictionaries": ["redis"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-redis@1/cspell-ext.json"],
  "dictionaries": ["redis"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-redis@1/cspell-ext.json
dictionaries:
  - redis
```

</details>

## Dictionary Information

| Name    | Enabled | Description       |
| ------- | ------- | ----------------- |
| `redis` |         | Redis dictionary. |
