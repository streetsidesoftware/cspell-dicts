## Local Installation

```sh
npm install -D @cspell/dict-perl
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-perl/cspell-ext.json"],
  "cSpell.dictionaries": ["perl"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-perl/cspell-ext.json"],
  "dictionaries": ["perl"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-perl/cspell-ext.json'
dictionaries:
  - perl
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-perl@1/cspell-ext.json"],
  "cSpell.dictionaries": ["perl"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-perl@1/cspell-ext.json"],
  "dictionaries": ["perl"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-perl@1/cspell-ext.json
dictionaries:
  - perl
```

</details>

## Dictionary Information

| Name   | Enabled | Description                                     |
| ------ | ------- | ----------------------------------------------- |
| `perl` |         | Perl built-in functions, keywords, and pragmas. |

## Language Settings

| Name   | Locale | File Type |
| ------ | ------ | --------- |
| `perl` | `*`    | `perl`    |
