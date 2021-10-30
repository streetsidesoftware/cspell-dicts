# CSpell VUE Configuration

Configuration bundle for VUE files.

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-vue
cspell link add @cspell/dict-vue
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-vue
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-vue/cspell-ext.json"],
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
