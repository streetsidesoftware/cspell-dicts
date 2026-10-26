# Source Directory

All source files used to generate the dictionary should be stored in this directory.

## Sources

<!--- @@inject: ../static/sources.csv#markdown --->

| Source      | From                                                               | License                                                                                                                         | Updated |
| ----------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------- |
| hunspell    | <https://github.com/wooorm/dictionaries/tree/main/dictionaries/nn> | [license](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/nn_NO/src/hunspell/dictionaries/nn/license) | by hand |
| LibreOffice | <https://github.com/LibreOffice/dictionaries/tree/master/no>       | [README](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/nn_NO/src/LibreOffice/no/README)             | by hand |

<!--- @@inject-end: ../static/sources.csv#markdown --->

## Changing a source

`sources.yaml` lists each source: its files, license, README, and where it came from. Each source is copied
into the folder of its name, next to it. To add or change a source, edit `sources.yaml`, copy its files into
the source's folder, and update `cspell-tools.config.yaml` if its word files changed.
