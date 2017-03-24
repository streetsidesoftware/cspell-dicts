# Cspell Polish Dictionary

Note, this is a work in progress.

## Using the dictionary with in a project cspell.json

Add the dictionary to the project
```sh
npm install -SD cspell-dict-pl_pl
```

Assuming `cspell.json` is in the project root.  Add the following to `cspell.json`
```javascript
    // Define each dictionary.  Relative paths are relative to the config file.
   "dictionaryDefinitions": [
       { "name": "Polish", "path": "./node_modules/cspell-dict-pl_pl/pl_pl.trie.gz"}
   ],
   // Dictionaries to be included
   "dictionaries": ["Polish"]
```


## Building

Building is only necessary if you want to modify the contents of the dictionary

```sh
npm run build
```

## Resources

The Hunspell source for this dictionary can be found in several repositories:

* https://github.com/titoBouzout/Dictionaries
* https://github.com/wooorm/dictionaries/tree/master/dictionaries/pl_PL

