# Cspell Russian Dictionary

Russian dictionary for cspell.

This is a pre-built dictionary for use with cspell.

It combines

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-ru_ru
cspell link add @cspell/dict-ru_ru
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-ru_ru
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-ru_ru/cspell-ext.json"],
    // …
}
```

## Resources

The Hunspell source for this dictionary can be found:

- https://github.com/wooorm/dictionaries/tree/master/dictionaries/ru_RU

## License

GPL-3.0-or-later

> Some packages may have other licenses included.

# Contributing

## Adding Missing Words

Please add words to [additional_words.txt](./src/additional_words.txt)

## Building

Building is only necessary if you want to modify the contents of the dictionary.
Note: Building the Russian dictionary takes at least 30 minutes.

```sh
yarn run build
```
