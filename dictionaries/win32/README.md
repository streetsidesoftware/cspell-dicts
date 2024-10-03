# CSpell Win32 Dictionary

Win32 dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-win32
cspell link add @cspell/dict-win32
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-win32
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-win32
```

The `cspell-ext.json` file in this package should be added to the import section in your CSpell configuration file.

**_`cspell.config.yaml`_**

```yaml
import: ['@cspell/dict-win32/cspell-ext.json']
```

**`cspell.json`**

```javascript
{
    // …
    "import": ["@cspell/dict-win32/cspell-ext.json"],
    // …
}
```

## Enable the Dictionary

By default the `win32` dictionary is enabled for `C` and `C++` file types. To enable it for other file types, it is necessary to add it to the `dictionaries` section of the configuration or include it as an inline CSpell directive: `cspell:dictionaries win32`.

Example: `example.md`

````markdown
Sample Code:

```cpp
    // Parse the command line parameters
    int argc;
    LPWSTR* argv = CommandLineToArgvW(GetCommandLineW(), &argc);
    pSample->ParseCommandLineArgs(argv, argc);
    LocalFree(argv);
```

<!--- cspell:dictionaries win32 --->
````

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

MIT

> Some packages may have other licenses included.
