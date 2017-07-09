# Cspell <%= name %> Dictionary

This is a pre-built dictionary for use with cspell.

## Usage

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.
```json
{
    …
    "import": ["<path to node>/cspell-dict-<%= packageName %>/cspell-ext.json"],
    …
}
```

## Building

Building is only necessary if you want to modify the contents of the dictionary.  Note: Building will take a few minutes for large files.

```sh
npm run build
```

## License

MIT