# Cspell Russian Dictionary

Note, this is a work in progress.

## Using the dictionary with in a project cspell.json

Add the dictionary to the project
```sh
npm install -SD cspell-dict-russian
```

Assuming `cspell.json` is in the project root.  Add the following to `cspell.json`
```javascript
    // Define each dictionary.  Relative paths are relative to the config file.
   "dictionaryDefinitions": [
       { "name": "Russian", "path": "./node_modules/cspell-dict-russian/Russian.trie.gz"}
   ],
   // Dictionaries to be included
   "dictionaries": ["Russian"]
```


## Building

Building is only necessary if you want to modify the contents of the dictionary.  Note: Building will take **many hours**.

```sh
npm run build
```

## Resources

The Hunspell source for this dictionary can be found:

* https://github.com/titoBouzout/Dictionaries

