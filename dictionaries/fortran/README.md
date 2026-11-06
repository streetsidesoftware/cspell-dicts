# CSpell Fortran Dictionary

Fortran keywords, intrinsic procedures, and intrinsic module names

This is a pre-built dictionary for use with CSpell.

It holds the words of the Fortran language itself, so they aren't reported as unknown words in Fortran code:

- keywords and statements, such as `allocatable`, `contains`, `enddo`, and `codimension`
- the intrinsic procedures of the Fortran 2023 standard, such as `achar`, `maxloc`, and `tokenize`
- common GNU Fortran extensions, such as `getarg` and `iargc`
- the names in the intrinsic modules `iso_fortran_env`, `iso_c_binding`, `ieee_arithmetic`, `ieee_exceptions`, and
  `ieee_features`
- I/O specifiers, such as `iostat`, `iomsg`, and `newunit`

OpenMP, OpenACC, and other vendors' extensions aren't included.

It's enabled for files with the file type `fortran`, `FortranFreeForm`, or `FortranFixedForm`. The last two are the
language IDs of the [Modern Fortran](https://marketplace.visualstudio.com/items?itemName=fortran-lang.linter-gfortran)
extension for VS Code. The dictionary gives files with these extensions, in lowercase or uppercase, the file type
`fortran` and one more:

- `FortranFixedForm`: `.f`, `.f77`, `.for`, `.ftn`
- `FortranFreeForm`: `.cuf`, `.f03`, `.f08`, `.f18`, `.f90`, `.f95`, `.fpp`, `.fypp`, `.pf`

Most of the words are derived from the word lists of [fortls](https://github.com/fortran-lang/fortls), the Fortran
language server, under its MIT license. The rest were added by hand.

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
npm install -D @cspell/dict-fortran
```

## Configuration

<details>
<summary>VSCode Settings</summary>

Add the following to your VSCode settings:

**`.vscode/settings.json`**

```jsonc
{
  "cSpell.import": ["@cspell/dict-fortran/cspell-ext.json"],
  "cSpell.dictionaries": ["fortran"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["@cspell/dict-fortran/cspell-ext.json"],
  "dictionaries": ["fortran"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - '@cspell/dict-fortran/cspell-ext.json'
dictionaries:
  - fortran
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
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fortran@0/cspell-ext.json"],
  "cSpell.dictionaries": ["fortran"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.json</code></summary>

**`cspell.json`**

```jsonc
{
  "import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-fortran@0/cspell-ext.json"],
  "dictionaries": ["fortran"],
}
```

</details>

<details>
<summary>CSpell Settings <code>cspell.config.yaml</code></summary>

**`cspell.config.yaml`**

```yaml
import:
  - https://cdn.jsdelivr.net/npm/@cspell/dict-fortran@0/cspell-ext.json
dictionaries:
  - fortran
```

</details>

## Dictionary Information

| Name      | Enabled | Description                                                        |
| --------- | ------- | ------------------------------------------------------------------ |
| `fortran` |         | Fortran keywords, intrinsic procedures, and intrinsic module names |

## Language Settings

| Name      | Locale | File Type                                        |
| --------- | ------ | ------------------------------------------------ |
| `fortran` | `*`    | `fortran`, `FortranFreeForm`, `FortranFixedForm` |

<!--- @@inject-end: ./static/install.md --->

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

| Source | From                                                                                                           | License                                                                                                         | Updated |
| ------ | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------- |
| fortls | <https://github.com/fortran-lang/fortls/tree/a94898dd852f06aa2eb72ff34e00caad3142efd0/fortls/parsers/internal> | [LICENSE](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/fortran/src/fortls/LICENSE) | by hand |

<!--- @@inject-end: ./static/sources.csv#markdown --->

## License

MIT

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
