# cspell-dicts

Various [cspell](https://github.com/streetsidesoftware/cspell) dictionaries. Each dictionary is its own package. See `README.md` in each directory.

## Language Dictionaries

- [Catalan](dictionaries/ca)
- [Czech](dictionaries/cs_CZ)
- [Danish](dictionaries/da_DK)
- [Dutch](dictionaries/nl_NL)
- [English - American](dictionaries/en_US) (Included by default in cspell and [VS Code Spell Checker](https://github.com/Jason-Rev/vscode-spell-checker))
- [English - British](dictionaries/en_GB) (Included by default in cspell and VS Code Spell Checker)
- [Esperanto](dictionaries/eo)
- [French](dictionaries/fr_FR)
- [German](dictionaries/de_DE)
- [Greek](dictionaries/el)
- [Hebrew](dictionaries/he)
- [Italian](dictionaries/it_IT)
- [Norwegian Bokmål](dictionaries/no_NB)
- [Persian](dictionaries/fa_IR)
- [Polish](dictionaries/pl_PL)
- [Portuguese - Brazilian](dictionaries/pt_BR)
- [Portuguese](dictionaries/pt_PT)
- [Russian](dictionaries/ru_RU) (Small)
- [Russian](dictionaries/russian) (Large)
- [Spanish](dictionaries/es_ES)
- [Swedish](dictionaries/sv)
- [Turkish](dictionaries/tr_TR)
- [Ukrainian](dictionaries/uk_UA)
- [Vietnamese](dictionaries/vi_VN)

## Programming Dictionaries

- [bash](dictionaries/bash) - Bash/Shell scripts
- [cpp](dictionaries/cpp) - C and C++
- [Django](dictionaries/django) - Django framework function names
- [Elixir](dictionaries/elixir)
- [Go](dictionaries/golang)
- [Java](dictionaries/java)
- [LaTex](dictionaries/latex)
- [Lua](dictionaries/lua)
- [PHP](dictionaries/php)
- [Python](dictionaries/python)
- [Ruby](dictionaries/ruby)
- [Rust](dictionaries/rust)
- [Scala](dictionaries/scala)

## Specialized Dictionaries

- [Cryptocurrencies](dictionaries/cryptocurrencies)
- [HTML Symbol Entities](dictionaries/html-symbol-entities)
- [lorem ipsum](dictionaries/lorem-ipsum)
- [Medical Terms](dictionaries/medicalterms)
- [Scientific Terms](dictionaries/scientific_terms_US)

## Contributing

Please help correct any mistakes in the dictionaries.

See: [Contributing](CONTRIBUTING.md)

## How to create a new dictionary

Please fork this repository to add new dictionaries.

## Install Yarn

[Installation | Yarn](https://classic.yarnpkg.com/en/docs/install)

### Using Yeoman script

The [Yeoman](http://yeoman.io/) script can help you create the dictionary template files seen in most of dictionary directories.

#### Running the generator

In the `cspell-dicts` repository root.

```sh
yarn create-dictionary <name> <path/to/source/words>
```

Yeoman will ask you a series of questions:

| Field         | Description                                                                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | this is the dictionary. i.e. en_AU or ruby                                                                                                                                                                                                                                 |
| friendly name | this is the friendly name, like Australian                                                                                                                                                                                                                                 |
| description   | short description of the dictionary.                                                                                                                                                                                                                                       |
| source file   | this is the source file to use to build the dictionary. It can be a .txt or hunspell .dic file. This file will be copied to the dictionary project.                                                                                                                        |
| local         | this is the two letter language code with an optional cultural code. a `*` mean it will match any language. More than one local can be added by separating them with a comma. i.e. en, en_AU.                                                                              |
| languageId    | this is the VS Code programming language id or file type. `*` will match all file types. Examples: `java`, `cpp`, `plaintext`, `markdown`, `ruby`. [Types know to cspell](https://github.com/streetsidesoftware/cspell/blob/master/packages/cspell-lib/src/LanguageIds.ts) |
| store as trie | for large source files (> 1MB) or hunspell files, this should be `y`. `n` will work for all programming language keyword files.                                                                                                                                            |
| run build     | prepare the word list so it can be used by cspell efficiently. You can always run the build step yourself in the dictionary directory `yarn run build`.                                                                                                                    |

Once all the questions have been answered, the dictionary directory will be created and the files will be copied.

Please update `README.md` and `LICENSE` files as necessary.

## Testing Dictionaries

### Smoke test

#### Linking

From the dictionary directory

```sh
cspell link add ./cspell-ext.json
```

This will add an entry in the cspell global config to import the `cspell-ext.json` file in the dictionary directory.

Use either VS Code or cspell to verify that files spell check correctly.

##### Verify with `cspell`

- Install `cspell`: `npm install -g cspell`
- Check the global links: `cspell link list`
- Check a file: `cspell check <path/to/source/file.ext> [--local=<locale>] [--language-id=<filetype>]`
  Example: `cspell check README.md --local=en,es` -- to check the readme file assuming English and Spanish words.

Checking a file will show you what has been ignored (gray) as well as what is considered an error (red):

![image](https://user-images.githubusercontent.com/3740137/41818772-72e20458-77b5-11e8-8d81-0f836ecf4e62.png)

##### Clean up

Remember to unlink when you are done:

```sh
cspell link remove ./cspell-ext.json
```

#### npm Global Install

From the dictionary directory:

```sh
npm install -g
```

From NPM repository:

```sh
npm install -g @cspell/dict-<name>
```

Then run the link command found in the dictionary `README.md` file.
It has the following pattern: `cspell link add @cspell/dict-<name>`.
To unlink: `cspell link remove @cspell/dict-<name>`

<!--
  cspell:ignore medicalterms
-->
