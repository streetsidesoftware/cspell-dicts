## Local Installation

```sh
npm install -D @cspell/dict-scientific-terms-us
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-scientific-terms-us/cspell-ext.json"],
  "cSpell.dictionaries": ["scientific-terms-us", "mathematics-terms-us"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-scientific-terms-us/cspell-ext.json"],
  "dictionaries": ["scientific-terms-us", "mathematics-terms-us"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-scientific-terms-us/cspell-ext.json'
dictionaries:
  - scientific-terms-us
  - mathematics-terms-us
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-us@3/cspell-ext.json"],
  "cSpell.dictionaries": ["scientific-terms-us", "mathematics-terms-us"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-us@3/cspell-ext.json"],
  "dictionaries": ["scientific-terms-us", "mathematics-terms-us"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-scientific-terms-us@3/cspell-ext.json
dictionaries:
  - scientific-terms-us
  - mathematics-terms-us
```

</details>

## Dictionary Information

| Name                   | Enabled | Description                      |
| ---------------------- | ------- | -------------------------------- |
| `scientific-terms-us`  | **Yes** | Scientific Terms US dictionary.  |
| `mathematics-terms-us` | **Yes** | Mathematics Terms US dictionary. |

## Language Settings

| Name                   | Locale | File Type |
| ---------------------- | ------ | --------- |
| `scientific-terms-us`  | `*`    | `*`       |
| `mathematics-terms-us` | `*`    | `*`       |
