# CSpell Norwegian Bokmål Dictionary

Norwegian Bokmål dictionary.

This is a pre-built dictionary for use with CSpell. It spell checks text written in Bokmål, one of the two written
standards of Norwegian.

The words come from the Hunspell dictionary of the
[spell-norwegian](https://github.com/wooorm/dictionaries/tree/main/dictionaries/nb) project, version 2.2 from 2016.
It hasn't been updated since, so newer words are missing. Compound words that the source doesn't list are flagged.

<!--- @@inject: ../../static/requirements.md#values-file=:../../static/engines.json&values-file=:cspell-ext.json --->

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>=8`   |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>=4`   |

<!--- @@inject-end: ../../static/requirements.md#values-file=:../../static/engines.json&values-file=:cspell-ext.json --->

<!--- @@inject: ./static/install.md --->

## Local Installation

```sh
npm install -D @cspell/dict-nb-no
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-nb-no/cspell-ext.json"],
  "cSpell.language": "nb, nb-no",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-nb-no/cspell-ext.json"],
  "language": "nb, nb-no",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-nb-no/cspell-ext.json'
language: nb, nb-no
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nb-no@2/cspell-ext.json"],
  "cSpell.language": "nb, nb-no",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nb-no@2/cspell-ext.json"],
  "language": "nb, nb-no",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-nb-no@2/cspell-ext.json
language: nb, nb-no
```

</details>

## Dictionary Information

| Name    | Enabled | Description                  |
| ------- | ------- | ---------------------------- |
| `nb-no` |         | Norwegian Bokmål dictionary. |

## Language Settings

| Name    | Locale        | File Type |
| ------- | ------------- | --------- |
| `nb-no` | `nb`, `nb-no` | `*`       |

<!--- @@inject-end: ./static/install.md --->

## Words Written Without æ, ø, and å

In code, email addresses, and file names, æ, ø, and å are often replaced, either with single letters (a, o, and a) or
with double letters (ae, oe, and aa). Språkrådet, the Language Council of Norway, gives advice on this in
[Æ, ø og å i internasjonal sammenheng](https://sprakradet.no/spraksporsmal-og-svar/ae-o-og-a-i-internasjonal-sammenheng/)
(in Norwegian).

To accept those spellings too, redefine the `nb-no` dictionary with a `repMap`. CSpell then also looks up each word with
the replacements. Words written with æ, ø, and å are still accepted. The definition needs `path`, relative to the
configuration file. Without it, the dictionary stops working.

### Single Letters

"blabar" is accepted as "blåbær", and "Gronland" as "Grønland".

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-nb-no/cspell-ext.json"],
  "language": "en, nb",
  "dictionaryDefinitions": [
    {
      "name": "nb-no",
      "path": "./node_modules/@cspell/dict-nb-no/dict/nb-no.trie.gz",
      "repMap": [
        ["a", "æ"],
        ["o", "ø"],
        ["a", "å"],
        ["A", "Æ"],
        ["O", "Ø"],
        ["A", "Å"],
      ],
    },
  ],
}
```

### Double Letters

"blaabaer" is accepted as "blåbær", and "Groenland" as "Grønland".

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-nb-no/cspell-ext.json"],
  "language": "en, nb",
  "dictionaryDefinitions": [
    {
      "name": "nb-no",
      "path": "./node_modules/@cspell/dict-nb-no/dict/nb-no.trie.gz",
      "repMap": [
        ["ae", "æ"],
        ["oe", "ø"],
        ["aa", "å"],
        ["Ae", "Æ"],
        ["Oe", "Ø"],
        ["Aa", "Å"],
      ],
    },
  ],
}
```

<!--- @@inject: ../../static/contributing.md --->

## Contributing

Please help correct any mistakes in the dictionaries.

See: [Contributing](https://github.com/streetsidesoftware/cspell-dicts#contributing)

Special thanks to all of our amazing contributors!

### Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

<!--- @@inject-end: ../../static/contributing.md --->

## Sources

<!--- @@inject: ./static/sources.csv#markdown --->

| Source   | From                                                               | License                                                                                                                         | Updated |
| -------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------- |
| hunspell | <https://github.com/wooorm/dictionaries/tree/main/dictionaries/nb> | [license](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/nb_NO/src/hunspell/dictionaries/nb/license) | by hand |

<!--- @@inject-end: ./static/sources.csv#markdown --->

## License

GPL-3.0-or-later

The sources keep their own licenses, listed in [Sources](#sources).

<!--- @@inject: ../../static/footer.md --->

<br/>

---

<p align="center">
Brought to you by <a href="https://streetsidesoftware.com" title="Street Side Software">
<img width="16" alt="Street Side Software Logo" src="https://i.imgur.com/CyduuVY.png" /> Street Side Software
</a>
</p>

<!--- @@inject-end: ../../static/footer.md --->

<!--- cspell:ignore blabar Gronland blaabaer Groenland --->
