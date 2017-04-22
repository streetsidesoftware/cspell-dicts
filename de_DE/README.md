# Cspell German Dictionary

## Using the dictionary with in a project cspell.json

Add the dictionary to the project
```sh
npm install -SD cspell-dict-de_de
```

Assuming `cspell.json` is in the project root.  Add the following to `cspell.json`
```javascript
    // Define each dictionary.  Relative paths are relative to the config file.
   "dictionaryDefinitions": [
       { "name": "de_de", "path": "./node_modules/cspell-dict-de_de/de_de.trie.gz"}
   ],
   // Dictionaries to be included
   "dictionaries": ["de_de"]
```


## Building

Building is only necessary if you want to modify the contents of the dictionary.  Note: Building will take a few minutes.

```sh
npm run build
```

## Resources

The Hunspell source for this dictionary can be found:

* https://github.com/titoBouzout/Dictionaries

