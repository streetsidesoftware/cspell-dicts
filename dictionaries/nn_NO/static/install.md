## Local Installation

```sh
npm install -D @cspell/dict-nn-no
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-nn-no/cspell-ext.json"],
  "cSpell.language": "nn, nn-NO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-nn-no/cspell-ext.json"],
  "language": "nn, nn-NO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-nn-no/cspell-ext.json'
language: nn, nn-NO
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nn-no@1/cspell-ext.json"],
  "cSpell.language": "nn, nn-NO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nn-no@1/cspell-ext.json"],
  "language": "nn, nn-NO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-nn-no@1/cspell-ext.json
language: nn, nn-NO
```

</details>

## Dictionary Information

| Name        | Enabled | Description                                                                       |
| ----------- | ------- | --------------------------------------------------------------------------------- |
| `nn-no`     |         | Norwegian Nynorsk dictionary.                                                     |
| `nn-no-alt` |         | Norwegian Nynorsk dictionary that also accepts words written without æ, ø, and å. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `nn-no` | `nn`, `nn-NO` | `*`       |
