# Source Directory

All source files used to generate the dictionary should be stored in this directory.

## Sources

<!--- @@inject: ../static/sources.csv#markdown --->

| Source | From                                                                                                           | License                                                                                                         | Updated |
| ------ | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------- |
| fortls | <https://github.com/fortran-lang/fortls/tree/a94898dd852f06aa2eb72ff34e00caad3142efd0/fortls/parsers/internal> | [LICENSE](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/fortran/src/fortls/LICENSE) | by hand |

<!--- @@inject-end: ../static/sources.csv#markdown --->

## Changing a source

`sources.yaml` lists each source: its files, license, README, and where it came from. Each source is copied
into the folder of its name, next to it. To add or change a source, edit `sources.yaml`, copy its files into
the source's folder, and update `cspell-tools.config.yaml` if its word files changed.
