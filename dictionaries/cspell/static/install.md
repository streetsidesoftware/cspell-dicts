## Local Installation

```sh
npm install -D @cspell/dict-cspell-bundle
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-cspell-bundle/cspell-ext.json"],
  "cSpell.dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-cspell-bundle/cspell-ext.json"],
  "dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-cspell-bundle/cspell-ext.json'
dictionaries: []
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-cspell-bundle/cspell-ext.json"],
  "cSpell.dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-cspell-bundle/cspell-ext.json"],
  "dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-cspell-bundle/cspell-ext.json
dictionaries: []
```

</details>

## Dictionary Information

| Name                   | Enabled | Description |
| ---------------------- | ------- | ----------- |
| `typescript`           |         | _External_  |
| `node`                 |         | _External_  |
| `npm`                  |         | _External_  |
| `html`                 |         | _External_  |
| `html-symbol-entities` |         | _External_  |
| `css`                  |         | _External_  |
| `fonts`                |         | _External_  |
| `php`                  |         | _External_  |

## Language Settings

| Name                   | Locale | File Type                                   |
| ---------------------- | ------ | ------------------------------------------- |
| `typescript`           |        | `javascript`, `javascriptreact`             |
| `typescript`           |        | `typescript`, `typescriptreact`, `mdx`      |
| `typescript`           |        | `html`, `pug`, `jade`, `php`, `handlebars`  |
| `node`                 |        | `javascript`, `javascriptreact`             |
| `node`                 |        | `typescript`, `typescriptreact`, `mdx`      |
| `node`                 |        | `json`, `jsonc`                             |
| `npm`                  |        | `javascript`, `javascriptreact`             |
| `npm`                  |        | `typescript`, `typescriptreact`, `mdx`      |
| `npm`                  |        | `markdown`, `asciidoc`                      |
| `npm`                  |        | `html`, `pug`, `jade`, `php`, `handlebars`  |
| `npm`                  |        | `json`, `jsonc`                             |
| `html`                 |        | `javascriptreact`, `typescriptreact`, `mdx` |
| `html`                 |        | `markdown`, `asciidoc`                      |
| `html`                 |        | `html`, `pug`, `jade`, `php`, `handlebars`  |
| `html-symbol-entities` |        | `javascriptreact`, `typescriptreact`, `mdx` |
| `html-symbol-entities` |        | `markdown`, `asciidoc`                      |
| `html-symbol-entities` |        | `html`, `pug`, `jade`, `php`, `handlebars`  |
| `css`                  |        | `javascriptreact`, `typescriptreact`, `mdx` |
| `css`                  |        | `html`, `pug`, `jade`, `php`, `handlebars`  |
| `css`                  |        | `css`, `less`, `scss`                       |
| `fonts`                |        | `javascriptreact`, `typescriptreact`, `mdx` |
| `fonts`                |        | `html`, `pug`, `jade`, `php`, `handlebars`  |
| `fonts`                |        | `css`, `less`, `scss`                       |
| `php`                  |        | `php`                                       |
