# Cspell Estonian Dictionary

This is a Cspell repackaging of the [wordlist](http://www.meso.ee/~jjpp/speller/) 
created by Jaak Pruulmann.

The following description has been taken from the webpage of the original author:

Wordlists
---------
The wordlists are based on work by the Institute of the Estonian Language,
subsequently improved by Jaak Pruulmann who also created the affix file.

Encoding issues
---------------
All dictionaries are encoded in the ISO-8859-15 (Latin-9) character-set,
which is absolutely necessary to accommodate the plethora of foreign words
featuring S- and Z-caron that see daily usage in the Estonian language.

Dictionaries to accomodate the ISO-8859-1 legacy encoding still used on 
some operating systems are also included for completion, but obviously
won't successfully proofread words that use S and Z with a caron accent.

Wordlist improvement
--------------------
Corrections to existing words and suggestions for new words are welcome.
Please send them to the author for inclusion in the next revision.

Contact Information
-------------------
Jaak Pruulmann <jjpp@meso.ee>


## Installation

Global Install and add to cspell global settings.

```sh
npm install -g @cspell/dict-et-ee
cspell link add @cspell/dict-et-ee
```

## Uninstall from cspell

```sh
cspell link remove @cspell/dict-et-ee
```

## Manual Installation

Manual installation is useful if you want to include this dictionary as part of your CI/CD lint process.

```
npm i @cspell/dict-et-ee
```

The `cspell-ext.json` file in this package should be added to the import section in your `cspell.json` file.

```javascript
{
    // …
    "import": ["@cspell/dict-et-ee/cspell-ext.json"],
    // …
}
```

# Dictionary Development

See: [How to Create a New Dictionary](https://github.com/streetsidesoftware/cspell-dicts#how-to-create-a-new-dictionary)

## License

MIT

> Some packages may have other licenses included.
