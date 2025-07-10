## Local Installation

**This package is bundled with CSpell.**

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "dictionaries": [],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
dictionaries: []
```

</details>

## Local Installation using CDN

> **NOTE:** This package is bundled with CSpell.

## Dictionary Information

| Name                   | Enabled | Description |
| ---------------------- | ------- | ----------- |
| `html`                 |         | _External_  |
| `html-symbol-entities` |         | _External_  |
| `typescript`           |         | _External_  |
| `css`                  |         | _External_  |

## Language Settings

| Name                   | Locale | File Type         |
| ---------------------- | ------ | ----------------- |
| `html`                 | `*`    | `markdown`, `mdx` |
| `html-symbol-entities` | `*`    | `markdown`, `mdx` |
| `typescript`           | `*`    | `mdx`             |
| `css`                  | `*`    | `mdx`             |

## Predefined Patterns

Predefined patterns can be used to ignore or include sequences of text to be spell checked.

The following patterns are defined in this dictionary:

| Name                      | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `MARKDOWN-link-reference` | Markdown reference link: `[This is a link][reference]`, matches `[reference]`                  |
| `MARKDOWN-link-footer`    | Markdown referenced link: `[reference]: https://www.google.com`, matches the entire reference. |
| `MARKDOWN-link`           | Markdown link: `[link text](link)`, matches `link`                                             |
| `MARKDOWN-anchor`         | Markdown Anchors: `<a id="my_link"></a>`, matches `my_link`                                    |
