# Node Dictionary Generation

The api docs came from:
https://github.com/nodejs/node/tree/master/doc/api

`extract-api.js` is used to extract the api into a single `node.txt` file.

Usage:

`extract-api.js <...api_files.md>`

Example:

`extract-api.js api/*.md`

How it works:

- It scans all the files looking for text between back ticks `` while ignoring code blocks.
- It sorts the results for each file.

`node-old.txt` is the previous version of the text file used to generate the node dictionary
it is now just used for testing purposes.
