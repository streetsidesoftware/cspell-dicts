# CSpell Julia Dictionary

Julia dictionary for cspell.

This is a pre-built dictionary for use with cspell.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-julia
cspell link add @cspell/dict-julia
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-julia
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
    // …
    "import": ["@cspell/dict-julia/cspell-ext.json"],
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

## Script to export all relevant Base functions

```julia
base_functions = names(Base) .|> string
# We get rid of operators like +, - etc...
filter!(f -> !isnothing(match(r"\w+", f)), base_functions)
open("./src/julia.txt", "w") do io
 println.(io, base_functions)
end;
```
