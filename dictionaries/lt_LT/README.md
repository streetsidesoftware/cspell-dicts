# CSpell Lithuanian Dictionary

Lithuanian dictionary for cspell. Based on ispell-lt package, version 1.3.

This is a pre-built dictionary for use with cspell.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-lt-lt
cspell link add @cspell/dict-lt-lt
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-lt-lt
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-lt-lt/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary. Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Resources

The Hunspell source for this dictionary can be found:

- https://launchpad.net/ispell-lt

## License

MIT

> Some packages may have other licenses included.
