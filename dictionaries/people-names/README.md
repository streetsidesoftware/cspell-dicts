# CSpell People Names Dictionary

People Names dictionary for cspell.

This is a pre-built dictionary for use with CSpell.

This dictionary is an attempt at a collection of people names. It is not definitive. Contributions that add names are welcome.

## Guidelines

Due to the sensitive nature of names it is important to be clear about what is included in
this dictionary. The idea here is to include names from all kinds of backgrounds and cultures, not just English or European (I call this out because this document was originally written in English including the examples below).

- Each entry is part of a person's name, not the entire time.
  For example, `John Smith` would not appear in the list, but `John` and `Smith` are ok.
- No distinction is made between first, middle, last names. Each one can be an entry in the list.
- All cultural and gender variants of a name are allowed.
- It is expected that a Google search of the name should return results confirming that it is a name.
- A name should not be a slur, disparaging, or derogatory term.
  For example, `Shithead` is not allowed.

  Exceptions:
  Names that were once common, but have become slang
  - `Dick` is allowed because it is a common derivate of `Richard`.
  - `Fanny` is allowed because it is a common derivate of `Frances`.

### Adding Names

Please open a pull to add names to the `src/names.txt` file.

- Add new names to the end of the file.
- One name per line.

**Note:** `src/names.txt` will get sorted as part of the release process.

### Name Removal

Names can be removed if they:

- Are actually misspelled. (`Johhn` would be replaced with `John`)
- Are not a person's name.
- Moderators reserve the right to refuse changes and additions.

Names will not be removed just because someone finds them offensive.

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
npm install -D @cspell/dict-people-names
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-people-names/cspell-ext.json"],
  "cSpell.dictionaries": ["people-names"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-people-names/cspell-ext.json"],
  "dictionaries": ["people-names"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-people-names/cspell-ext.json'
dictionaries:
  - people-names
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-people-names@1/cspell-ext.json"],
  "cSpell.dictionaries": ["people-names"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-people-names@1/cspell-ext.json"],
  "dictionaries": ["people-names"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-people-names@1/cspell-ext.json
dictionaries:
  - people-names
```

</details>

## Dictionary Information

| Name           | Enabled | Description              |
| -------------- | ------- | ------------------------ |
| `people-names` | **Yes** | People Names dictionary. |

<!--- @@inject-end: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Contributing

Please help correct any mistakes in the dictionaries.

See: [Contributing](https://github.com/streetsidesoftware/cspell-dicts#contributing)

Special thanks to all of our amazing contributors!

### Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

<!--- @@inject-end: ../../static/contributing.md --->

## License

MIT

> Some packages may have other licenses included.

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->

<!--- cspell:ignore Johhn --->
