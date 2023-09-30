# CSpell he Dictionary

Dictionary for Hebrew language

This is a pre-built dictionary for use with cspell.

# About the Dictionary

The Hebrew Dictionary has been compiled from the Hunspell Hebrew Dictionary:

> By the Hspell project (http://hspell.ivrix.org.il/).
> Hspell version 1.4 was used.
> Copyright 2004-2017, Nadav Har'El and Dan Kenigsberg
> The dictionary (this file and the corresponding word list)
> is licensed under the GNU Affero General Public License

But, due to the complexity of the Hebrew language, a significant portion of the dictionary was not able to be
included in this extension.

<!--- cspell:ignore hspell, Nadav Har'El, Dan Kenigsberg --->

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-he
cspell link add @cspell/dict-he
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-he
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-he/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## License

MIT

> Some packages may have other licenses included.
