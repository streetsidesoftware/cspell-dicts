# Creating / Contributing Dictionaries

There are two types of dictionaries. Programming / file-type dictionaries and natural language dictionaries.

# Programming / File-type Dictionaries

Examples include [TypeScript / JavaScript](../dictionaries/typescript) and [Python](../dictionaries/python).

These include keywords, common libraries, function names, and other words associated with that ecosystem.

# Natural Language Dictionaries

Examples include [English US](../dictionaries/en_US).

## Building from Hunspell

[TBD]

## Dictionary Definition

| field                 | Descripton                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| name                  | This is the name of the dictionary, it is good practice to have it match the locale, i.e. `en_us` or `pt_br` |
| path                  | This is the relative path from the `cspell-ext.json` file to the dictionary `.trie.gz` files.                |
| description           | This should be an easy to read description of the languages, i.e. `British English Dictionary`.              |
| dictionaryInformation | See [Dictionary Information](#dictionaryinformation)                                                         |

## Dictionary Information

See Dutch example: [Dutch `cspell.config.yaml`](./dictionaries/nl_NL/cspell.config.yaml).

| field    | example         | Description                            |
| -------- | --------------- | -------------------------------------- |
| alphabet | `a-zA-Zé`       | These are the letters of the Alphabet. |
| locale   | `nl-NL`         | This is the locale of the dictionary.  |
| accents  | `\u0300-\u0308` | Accent characters.                     |

# Tips and Tricks

## Using `.yaml` files.

Writing configuration in Yaml can be much easier that writing in JSON.

Just have the `cspell-ext.json` file import the Yaml file.

`cspell-ext.json`

```json
{
  "import": ["./cspell.config.yaml"]
}
```
