## Local Installation

```sh
npm install -D @cspell/dict-fr-reforme
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-fr-reforme/cspell-ext.json"],
  "cSpell.language": "fr, fr-90, fr-fr",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-fr-reforme/cspell-ext.json"],
  "language": "fr, fr-90, fr-fr",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-fr-reforme/cspell-ext.json'
language: fr, fr-90, fr-fr
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fr-reforme@2/cspell-ext.json"],
  "cSpell.language": "fr, fr-90, fr-fr",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fr-reforme@2/cspell-ext.json"],
  "language": "fr, fr-90, fr-fr",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-fr-reforme@2/cspell-ext.json
language: fr, fr-90, fr-fr
```

</details>

## Dictionary Information

| Name       | Enabled | Description                       |
| ---------- | ------- | --------------------------------- |
| `fr-fr-90` |         | Français Réforme 1990 dictionary. |

## Language Settings

| Name       | Locale                 | File Type |
| ---------- | ---------------------- | --------- |
| `fr-fr-90` | `fr`, `fr-fr`, `fr-90` | `*`       |
