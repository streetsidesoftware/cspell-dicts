# CSpell Galician Dictionary (Spain)

Galician Dictionary (Spain)

This is a pre-built dictionary for use with CSpell.

<!--- @@inject: ../../static/requirements.md --->

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 8`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 4`  |

<!--- @@inject-end: ../../static/requirements.md --->

<!--- @@inject: ./static/install.md --->

## Local Installation

```sh
npm install -D @cspell/dict-gl-es
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-gl-es/cspell-ext.json"],
  "cSpell.language": "gl, gl_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-gl-es/cspell-ext.json"],
  "language": "gl, gl_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-gl-es/cspell-ext.json'
language: gl, gl_ES
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gl-es/cspell-ext.json"],
  "cSpell.language": "gl, gl_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-gl-es/cspell-ext.json"],
  "language": "gl, gl_ES",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-gl-es/cspell-ext.json
language: gl, gl_ES
```

</details>

## Dictionary Information

| Name    | Enabled | Description                 |
| ------- | ------- | --------------------------- |
| `gl-es` |         | Galician Dictionary (Spain) |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `gl-es` | `gl`, `gl_ES` | `*`       |

<!--- @@inject-end: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Contributing

Please help correct any mistakes in the dictionaries.

See: [Contributing](https://github.com/streetsidesoftware/cspell-dicts#contributing)

Special thanks to all of our amazing contributors!

### Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

<!--- @@inject-end: ../../static/contributing.md --->

## Adding Words

Please add any words to [src/additional_words.txt](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/gl_ES/src/additional_words.txt) by making a pull request.

## License

MIT

> Some packages may have other licenses included.

## Acknowledgements

Contributed by:

- [Borja Paz Rodríguez](https://github.com/borjapazr)

This dictionary makes use of the following open source projects:

- [hunspell-gl](https://gitlab.com/trasno/hunspell-gl) ([Proxecto Trasno](https://trasno.gal/))

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->
