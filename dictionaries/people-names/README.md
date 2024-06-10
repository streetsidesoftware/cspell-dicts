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

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g @cspell/dict-people-names
cspell link add @cspell/dict-people-names
```

## Uninstall from CSpell

```sh
cspell link remove @cspell/dict-people-names
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-people-names
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-people-names/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

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
