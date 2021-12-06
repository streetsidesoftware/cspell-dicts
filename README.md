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

## All Dictionaries

<!--- Use `yarn run generate-doc-dictionaries` to generate this table --->

| dictionary                                                                      | name                               | file type                                                                                                   | locale             | description                                           |
| ------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------- |
| [@cspell/dict-ada](./dictionaries/ada#readme)                                   | Ada Language                       | ada                                                                                                         | \*                 | Ada Language Dictionary                               |
| [@cspell/dict-aws](./dictionaries/aws#readme)                                   | AWS                                | \*                                                                                                          | \*                 | AWS dictionary for cspell.                            |
| [@cspell/dict-bash](./dictionaries/bash#readme)                                 | bash                               | shellscript                                                                                                 | \*                 | Bash dictionary for cspell.                           |
| [@cspell/dict-bg-bg](./dictionaries/bg_BG#readme)                               | Bulgarian                          | \*                                                                                                          | bg, bg-BG          | Bulgarian dictionary for cspell.                      |
| [@cspell/dict-ca](./dictionaries/ca#readme)                                     | Catalan                            | \*                                                                                                          | ca                 | Catalan dictionary for cspell.                        |
| [@cspell/dict-city-names-finland](./dictionaries/city-names-finland#readme)     | Cities of Finland                  | \*                                                                                                          | \*                 | List of cities in Finland.                            |
| [@cspell/dict-clojure](./dictionaries/clojure#readme)                           | clojure                            | clojure                                                                                                     | \*                 | Clojure dictionary for cspell.                        |
| [@cspell/dict-companies](./dictionaries/companies#readme)                       | Company names                      |                                                                                                             |                    | Company names dictionary for cspell.                  |
| [@cspell/dict-cpp](./dictionaries/cpp#readme)                                   | C/C++ Dictionary                   | c, cpp                                                                                                      | \*                 | C/C++ Keywords and common library functions.          |
| [@cspell/dict-cryptocurrencies](./dictionaries/cryptocurrencies#readme)         | Cryptocurrencies                   | \*                                                                                                          | \*                 | Cryptocurrencies dictionary for cspell.               |
| [@cspell/dict-cs-cz](./dictionaries/cs_CZ#readme)                               | Czech                              | \*                                                                                                          | cs                 | Czech dictionary for cspell.                          |
| [@cspell/dict-csharp](./dictionaries/csharp#readme)                             | csharp                             | csharp                                                                                                      | \*                 | C# dictionary for cspell.                             |
| [@cspell/dict-css](./dictionaries/css#readme)                                   | css                                | css                                                                                                         | \*                 | Css dictionary for cspell.                            |
| [@cspell/dict-da-dk](./dictionaries/da_DK#readme)                               | Danish                             | \*                                                                                                          | da, da-DK          | Danish dictionary for cspell.                         |
| [@cspell/dict-de-de](./dictionaries/de_DE#readme)                               | German Dictionary                  | \*                                                                                                          | de, de_DE          | German (de-DE) Dictionary.                            |
| [@cspell/dict-django](./dictionaries/django#readme)                             | Django Keywords                    | html; python                                                                                                | \*; \*             | List of Python Django Framework keywords.             |
| [@cspell/dict-dotnet](./dictionaries/dotnet#readme)                             | .Net Dictionary                    | cs                                                                                                          | \*                 | .Net keywords.                                        |
| [@cspell/dict-el](./dictionaries/el#readme)                                     | Greek                              | \*                                                                                                          | el                 | Greek dictionary for cspell.                          |
| [@cspell/dict-elixir](./dictionaries/elixir#readme)                             | elixir                             | elixir                                                                                                      | \*                 | Elixir dictionary for cspell.                         |
| [@cspell/dict-en-gb](./dictionaries/en_GB#readme)                               | British English Dictionary         | \*                                                                                                          | en-GB              | British English Dictionary                            |
| [@cspell/dict-en-gb-mit](./dictionaries/en_GB-MIT#readme)                       | British English Dictionary Limited | \*                                                                                                          | en-GB              | British English Dictionary with MIT License           |
| [@cspell/dict-en_us](./dictionaries/en_US#readme)                               | American English Dictionary        | \*                                                                                                          | en, en-US          | American English Dictionary                           |
| [@cspell/dict-eo](./dictionaries/eo#readme)                                     | Esperanto                          | \*                                                                                                          | eo                 | Esperanto dictionary for cspell.                      |
| [@cspell/dict-es-es](./dictionaries/es_ES#readme)                               | Spanish Dictionary (Spain)         | \*                                                                                                          | es, es_ES          | Spanish Dictionary (Spain)                            |
| [@cspell/dict-et-ee](./dictionaries/et-EE#readme)                               | Estonian                           | \*                                                                                                          | et, et-EE          | Estonian dictionary for cspell.                       |
| [@cspell/dict-fa-ir](./dictionaries/fa_IR#readme)                               | Persian Dictionary                 | \*                                                                                                          | fa, fa-IR          | Persian Dictionary                                    |
| [@cspell/dict-filetypes](./dictionaries/filetypes#readme)                       | filetypes                          |                                                                                                             |                    | Filetypes dictionary for cspell.                      |
| [@cspell/dict-fonts](./dictionaries/fonts#readme)                               | font names                         |                                                                                                             |                    | Font names dictionary for cspell.                     |
| [@cspell/dict-fr-fr](./dictionaries/fr_FR#readme)                               | French Dictionary (France)         | \*                                                                                                          | fr, fr_FR          | French Dictionary (France)                            |
| [@cspell/dict-fr-reforme](./dictionaries/fr_FR_90#readme)                       | Français Réforme 1990              | \*                                                                                                          | fr, fr-fr, fr-90   | Français Réforme 1990 dictionary for cspell.          |
| [@cspell/dict-fullstack](./dictionaries/fullstack#readme)                       | Fullstack                          | php, javascript, typescript, cpp, c, python, ruby, swift, csharp, ada, html, java, lua, h, hpp, rust, scala | \*                 | Common words encountered during fullstack development |
| [@cspell/dict-golang](./dictionaries/golang#readme)                             | Go Language                        | go                                                                                                          | \*                 | Go Language Dictionary                                |
| [@cspell/dict-haskell](./dictionaries/haskell#readme)                           | Haskell                            | haskell                                                                                                     | \*                 | Haskell dictionary for cspell.                        |
| [@cspell/dict-he](./dictionaries/he#readme)                                     | Hebrew Dictionary                  | \*                                                                                                          | he                 | Hebrew Dictionary                                     |
| [@cspell/dict-hr-hr](./dictionaries/hr_HR#readme)                               | Croatian                           | \*                                                                                                          | hr, hr-HR          | Croatian dictionary for cspell.                       |
| [@cspell/dict-html](./dictionaries/html#readme)                                 | html                               | html                                                                                                        | \*                 | Html dictionary for cspell.                           |
| [@cspell/dict-html-symbol-entities](./dictionaries/html-symbol-entities#readme) | HTML Symbol Entities               | html; markdown                                                                                              | \*; \*             | HTML Symbol Entities Dictionary                       |
| [@cspell/dict-it-it](./dictionaries/it_IT#readme)                               | Italian                            | \*                                                                                                          | it, it-IT          | Italian dictionary for cspell.                        |
| [@cspell/dict-java](./dictionaries/java#readme)                                 | Java                               | java                                                                                                        | \*                 | Java dictionary for cspell.                           |
| [@cspell/dict-latex](./dictionaries/latex#readme)                               | LaTeX                              | latex                                                                                                       | \*                 | LaTeX cspell dictionary                               |
| [@cspell/dict-lorem-ipsum](./dictionaries/lorem-ipsum#readme)                   | lorem-ipsum                        | \*                                                                                                          | lorem, lorem-ipsum | Lorem-ipsum dictionary for cspell.                    |
| [@cspell/dict-lt-lt](./dictionaries/lt_LT#readme)                               | Lithuanian                         | \*                                                                                                          | lt, lt-LT          | Lithuanian dictionary for cspell.                     |
| [@cspell/dict-lua](./dictionaries/lua#readme)                                   | lua                                | lua                                                                                                         | \*                 | Lua dictionary for cspell.                            |
| [@cspell/dict-medicalterms](./dictionaries/medicalterms#readme)                 | Medical terms                      |                                                                                                             |                    | Medical Terms Dictionary                              |
| [@cspell/dict-mnemonics](./dictionaries/mnemonics#readme)                       | Mnemonics                          | c, cpp, h, hpp                                                                                              | \*                 | i86 Mnemonics dictionary for cspell                   |
| [@cspell/dict-nb-no](./dictionaries/nb_NO#readme)                               | Norwegian Bokmål                   | \*                                                                                                          | nb, nb-no          | Norwegian Bokmål dictionary for cspell.               |
| [@cspell/dict-nl-nl](./dictionaries/nl_NL#readme)                               | Dutch (Netherlands) Dictionary     | \*                                                                                                          | nl, nl-NL          | Dutch (Netherlands) Dictionary                        |
| [@cspell/dict-node](./dictionaries/node#readme)                                 | Node.js                            | javascript, typescript                                                                                      | \*                 | Node.js dictionary for cspell.                        |
| [@cspell/dict-npm](./dictionaries/npm#readme)                                   | NPM                                | javascript, typescript                                                                                      | \*                 | NPM dictionary for cspell.                            |
| [@cspell/dict-php](./dictionaries/php#readme)                                   | PHP Dictionary                     | php                                                                                                         | \*                 | Php dictionary for cspell.                            |
| [@cspell/dict-pl_pl](./dictionaries/pl_PL#readme)                               | Polish Dictionary                  | \*                                                                                                          | pl, pl_PL          | Polish Dictionary                                     |
| [@cspell/dict-powershell](./dictionaries/powershell#readme)                     | PowerShell Dictionary              | powershell                                                                                                  | \*                 | PowerShell Keyword Dictionary                         |
| [@cspell/dict-pt-br](./dictionaries/pt_BR#readme)                               | Portuguese (Brazilian) Dictionary  | \*                                                                                                          | pt, pt_BR          | Portuguese (Brazilian) Dictionary                     |
| [@cspell/dict-pt-pt](./dictionaries/pt_PT#readme)                               | Portuguese Dictionary (Portugal)   | \*                                                                                                          | pt, pt_PT          | Portuguese Dictionary (Portugal)                      |
| [@cspell/dict-public-licenses](./dictionaries/public-licenses#readme)           | Common Public Licenses             |                                                                                                             |                    | Common Public Licenses dictionary for cspell.         |
| [@cspell/dict-python](./dictionaries/python#readme)                             | Python Dictionary                  | python                                                                                                      | \*                 | Python Keyword Dictionary                             |
| [@cspell/dict-ru_ru](./dictionaries/ru_RU#readme)                               | Russian Dictionary (Combined)      | \*                                                                                                          | ru, ru-ru          | Russian Dictionary (Combined)                         |
| [@cspell/dict-ruby](./dictionaries/ruby#readme)                                 | Ruby                               | ruby                                                                                                        | \*                 | For ruby and ruby on rails                            |
| [@cspell/dict-rust](./dictionaries/rust#readme)                                 | Rust Dictionary                    | rust                                                                                                        | \*                 | Rust Keyword Dictionary                               |
| [@cspell/dict-scala](./dictionaries/scala#readme)                               | Scala                              | scala                                                                                                       | \*                 | Scala dictionary for cspell.                          |
| [@cspell/dict-scientific-terms-us](./dictionaries/scientific_terms_US#readme)   | Scientific Terms US                | \*                                                                                                          | \*                 | Scientific Terms US dictionary for cspell.            |
| [@cspell/dict-software-terms](./dictionaries/software-terms#readme)             | Software Terms                     |                                                                                                             |                    | Software terms dictionary for cspell.                 |
| [@cspell/dict-sv](./dictionaries/sv#readme)                                     | Swedish Dictionary                 | \*                                                                                                          | sv, sv_SE          | Swedish Dictionary                                    |
| [@cspell/dict-swift](./dictionaries/swift#readme)                               | Swift                              | swift                                                                                                       | \*                 | Swift dictionary for cspell.                          |
| [@cspell/dict-tr-tr](./dictionaries/tr_TR#readme)                               | Turkish                            | \*                                                                                                          | tr, tr-TR          | Turkish dictionary for cspell.                        |
| [@cspell/dict-typescript](./dictionaries/typescript#readme)                     | TypeScript                         | typescript, javascript, typescriptreact, javascriptreact                                                    | \*                 | TypeScript and JavaScript dictionary for cspell.      |
| [@cspell/dict-uk-ua](./dictionaries/uk_UA#readme)                               | Ukrainian Dictionary               | \*                                                                                                          | uk                 | Ukrainian Dictionary                                  |
| [@cspell/dict-vi-vn](./dictionaries/vi_VN#readme)                               | Vietnamese                         | \*                                                                                                          | vi                 | Vietnamese dictionary for cspell.                     |
| [@cspell/dict-vue](./dictionaries/vue#readme)                                   | vue                                | vue                                                                                                         | \*                 | CSpell configuration for VUE files                    |
| [@cspell/dict-win32](./dictionaries/win32#readme)                               | Win32                              | c, cpp                                                                                                      | \*                 | Win32 dictionary for cspell.                          |

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

Run yarn to make sure everything is installed.

```sh
yarn
```

Run `create-dictionary` to start the Yeoman script.

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
  cspell:ignore medicalterms Réforme
-->
