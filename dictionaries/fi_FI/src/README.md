# Source Directory

All source files used to generate the dictionary should be stored in this directory.

Credits to github user [fginter](https://github.com/fginter/hunspell-fi) for the finnish hunspell files.

The hunspell files used for finnish dictionary is build on top of [fginter](https://github.com/fginter/hunspell-fi)' hunspell files by adding finnish [names](https://www.avoindata.fi/data/fi/dataset/none), [surnames](https://www.avoindata.fi/data/fi/dataset/none) and [places](https://www.maanmittauslaitos.fi/nimiston-kyselypalvelu-ogc-api). Names, surnames and places were fetched in October 2024. Names without any matching / close-enough inflections found from the original hunspell dictionary were not included. Otherwise, the names were added to the dictionary with found inflections.

## Disclaimer

Inflections for the Finnish names, surnames and places are not perfect, many of which either has extraneous, wrong or missing inflections. This is due to programmatic nature of adding them and I personally hardly know the difference between a verb and an adjective.

<!--- cspell:ignore fginter --->
