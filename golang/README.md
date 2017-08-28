# Cspell Golang Dictionary

This is a pre-built dictionary for use with cspell.

Supports keywords and built-in library names up to Go 1.9.

## Usage

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["<path to node>/cspell-dict-golang/cspell-ext.json"],
    // …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary.  Note: Building will take a few minutes for large files.

```sh
npm run build
```

## Contributors
@AlekSi - Alexey Palazhchenko

## License

MIT