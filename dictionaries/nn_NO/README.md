# CSpell Norwegian Nynorsk Dictionary

Norwegian Nynorsk dictionary.

This is a pre-built dictionary for use with CSpell. It spell checks text written in Nynorsk, one of the two written
standards of Norwegian. For Norwegian Bokmål, use
[@cspell/dict-nb-no](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/nb_NO#readme).

The words come from two sources:

1. The Hunspell dictionary of the
   [spell-norwegian](https://github.com/wooorm/dictionaries/tree/main/dictionaries/nn) project, version 2.2 from 2016.
   It has compounds and genitives.
2. [LibreOffice's Norwegian dictionaries](https://github.com/LibreOffice/dictionaries/tree/master/no),
   version 3.0 from 2026. LibreOffice's list adds newer words, from Ordbanken and the 2018–2024 revision of
   Nynorskordboka.

Compound words that neither source lists are flagged.

<!--- cspell:ignore blaabaer Groenland blabar Gronland sammenheng --->

<!--- cspell:ignore Ordbanken Bungum Nyordsliste CLARIN likestillingsdepartementet Standardordbøkene Revisjonsprosjektet --->

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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nn-no@0/cspell-ext.json"],
  "cSpell.language": "nn, nn-NO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-nn-no@0/cspell-ext.json"],
  "language": "nn, nn-NO",
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-nn-no@0/cspell-ext.json
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

<!--- @@inject-end: ./static/install.md --->

## Words Written Without æ, ø, and å

In code, email addresses, and file names, æ, ø, and å are often replaced. Språkrådet, the Language Council of Norway,
gives advice on this in
[Æ, ø og å i internasjonal sammenheng](https://sprakradet.no/spraksporsmal-og-svar/ae-o-og-a-i-internasjonal-sammenheng/)
(in Norwegian).

Double letters work by default: ae, oe, and aa. "blaabaer" is accepted as "blåbær", and "Groenland" as "Grønland".

To accept single letters too (a, o, and a), add the `nn-no-alt` dictionary. It has the same words as `nn-no`.
"blabar" is accepted as "blåbær", and "Gronland" as "Grønland".

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-nn-no/cspell-ext.json"],
  "dictionaries": ["nn-no-alt"],
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

| Source      | From                                                               | License                                                                                                                         | Updated |
| ----------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------- |
| hunspell    | <https://github.com/wooorm/dictionaries/tree/main/dictionaries/nn> | [license](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/nn_NO/src/hunspell/dictionaries/nn/license) | by hand |
| LibreOffice | <https://github.com/LibreOffice/dictionaries/tree/master/no>       | [README](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/nn_NO/src/LibreOffice/no/README)             | by hand |

<!--- @@inject-end: ./static/sources.csv#markdown --->

## Attribution

The word list from LibreOffice, merged by Lars Bungum, includes:

- Ordbanken, from Nasjonalbiblioteket / Språkbanken, under
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Nyordsliste etter revisjon av Nynorskordboka (2018–2024),
  by Standardordbøkene, Revisjonsprosjektet (2018–2024), published by the University of Bergen (Department of
  Linguistic, Literary and Aesthetic Studies) and Språkrådet, <http://hdl.handle.net/11509/151>, under
  [CLARIN PUB +BY](https://www.kielipankki.fi/wp-content/uploads/CLARIN_PUB_BY_en.html). The revision was funded by
  Kultur- og likestillingsdepartementet.
- [Årets ord](https://sprakradet.no/nyord-og-rettskrivingsendringer/arets-ord/) from Språkrådet.

CLARIN PUB +BY is one of the licenses used in [CLARIN](https://www.clarin.eu/content/clarin-nutshell), the European
research infrastructure for language resources. It lets anyone use, copy, and distribute the resource, also modified or
as part of a larger work, as long as the authors are credited.

The affix files and the older word list come from the spell-norwegian project, under the GNU GPL, version 2 or later.

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
