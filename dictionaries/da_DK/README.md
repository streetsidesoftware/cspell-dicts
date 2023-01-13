# CSpell Danish Dictionary

Danish dictionary for cspell.

This is a pre-built dictionary, based on [stavekontrolden.dk](https://www.stavekontrolden.dk), for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-da-dk
cspell link add @cspell/dict-da-dk
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-da-dk
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-da-dk/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Contributors

- [Viktor Strate Kløvedal](https://github.com/viktorstrate)

## License

This package is licensed under MIT

The dictionary is licensed under the following licenses. See LICENSE for more

GNU GPL version 2.0
GNU LGPL version 2.1
Mozilla MPL version 1.1

<!---
cspell:words Viktor Strate Kløvedal
--->
