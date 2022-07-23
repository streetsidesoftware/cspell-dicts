# CSpell <%= friendlyName %> Dictionary

<%= description %>

This is a pre-built dictionary for use with CSpell.

## Installation

Global Install and add to CSpell global settings.

```sh
npm install -g <%= fullPackageName %>
cspell link add <%= fullPackageName %>
```

## Uninstall from CSpell

```sh
cspell link remove <%= fullPackageName %>
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i <%= fullPackageName %>
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["<%= fullPackageName %>/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

MIT

> Some packages may have other licenses included.
