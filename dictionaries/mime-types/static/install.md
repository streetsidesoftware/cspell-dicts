## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-mime-types
cspell link add @cspell/dict-mime-types
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.dictionaries": ["mime-types"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "dictionaries": ["mime-types"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
dictionaries:
  - mime-types
```

</details>

## Dictionary Information

| Name         | Enabled | Description           |
| ------------ | ------- | --------------------- |
| `mime-types` | Yes     | MIME Types dictionary. |
