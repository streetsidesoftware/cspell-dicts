# cspell-dicts

Various [cspell](https://github.com/Jason3S/cspell) dictionaries. Each dictionary is its own package. See `README.md` in each directory.

## Dictionaries

- [Dutch](nl_NL)
- [English - American](en_US) (Included by default in cspell and [VS Code Spell Checker](https://github.com/Jason-Rev/vscode-spell-checker))
- [English - British](en_GB) (Include by default in cspell and VS Code Spell Checker)
- [French](fr_FR)
- [German](de_DE)
- [Polish](pl_PL)
- [Portuguese](pt_PT)
- [Portuguese - Brazilian](pt_BR)
- [Russian](ru_RU) (Small)
- [Russian](russian) (Large)
- [Spanish](es_ES)


## Specialized Dictionaries

- [HTML Symbol Entities](https://github.com/Jason3S/cspell-dicts/tree/master/html-symbol-entities)


## Contributing

Please help correct any mistakes in the dictionaries.


## How to create a new dictionary

Please fork this repository to add new dictionaries.

### Using Yeoman script

The [Yeoman](http://yeoman.io/) script can help you create the dictionary template files seen in most of dictionary directories.

#### Install Yeoman

Install Yeoman and then link the generator.

```sh
npm install -g yo
cd generator-cspell-dicts
npm link
cd ..
```

#### Running the generator.

In the `cspell-dicts` repository root.

```sh
yo cspell-dicts <name> <path/to/source/words>
```

Yeoman will ask you a series of questions:

Field | Description
---------|------------
name | this is the dictionary. i.e. en_AU or ruby
friendly name | this is the friendly name, like Australian
description | short description of the dictionary.
source file | this is the source file to use to build the dictionary. It can be a .txt or hunspell .dic file. This file will be copied to the dictionary project.
local | this is the two letter language code with an optional cultural code. a `*` mean it will match any language. More than one local can be added by separating them with a comma. i.e. en, en_AU.
languageId | this is the VS Code programming language id or file type. `*` will match all file types. Examples: `java`, `cpp`, `plaintext`, `markdown`, `ruby`. [Types know to cspell](https://github.com/Jason3S/cspell/blob/master/src/LanguageIds.ts)
store as trie | for large source files (> 1MB) or hunspell files, this should be `y`. `n` will work for all programming language keyword files.
run build | prepare the word list so it can be used by cspell efficiently. You can always run the build step yourself in the dictionary directory `npm run build`.

Once all the questions have been answered, the dictionary directory will be created and the files will be copied.

Please update `README.md` and `LICENSE` files as necessary.


## Testing Dictionaries

### Smoke test

#### Linking

From the dictionary directory

```sh
npm run cspell-link
```

This will add an entry in the cspell global config to import the `cspell-ext.json` file in the dictionary directory.

Use either VS Code or cspell to verify that files spell check correctly.

Remember to unlink when you are done:

```sh
npm run cspell-unlink
```

#### npm Global Install

From the dictionary directory.

```sh
npm install -g
```

Then run the link command found in the dictionary `README.md` file.  
It has the following pattern: `cspell-dict-<name>-link`.  
To unlink: `cspell-dict-<name>-unlink`
