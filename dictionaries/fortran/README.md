# CSpell Fortran Dictionary

Fortran keywords, intrinsic procedures, and intrinsic module names

This is a pre-built dictionary for use with CSpell.

It holds the words of the Fortran language itself, so they aren't reported as unknown words in Fortran code:

- keywords and statements, such as `allocatable`, `contains`, `enddo`, and `codimension`
- the intrinsic procedures of the Fortran 2023 standard, such as `achar`, `maxloc`, and `tokenize`
- common GNU Fortran extensions, such as `getarg` and `iargc`
- the names in the intrinsic modules `iso_fortran_env`, `iso_c_binding`, `ieee_arithmetic`, `ieee_exceptions`, and
  `ieee_features`
- I/O specifiers, such as `iostat`, `iomsg`, and `newunit`

OpenMP, OpenACC, and other vendors' extensions aren't included.

It's enabled for files with the file type `fortran`, `FortranFreeForm`, or `FortranFixedForm`. The last two are the
language IDs of the [Modern Fortran](https://marketplace.visualstudio.com/items?itemName=fortran-lang.linter-gfortran)
extension for VS Code. The dictionary gives these file types to files with these extensions:

- `FortranFixedForm`: `.f`, `.f77`, `.for`, `.ftn`
- `FortranFreeForm`: `.cuf`, `.f03`, `.f08`, `.f18`, `.f90`, `.f95`, `.fpp`, `.fypp`, `.pf`

Most of the words are derived from the word lists of [fortls](https://github.com/fortran-lang/fortls), the Fortran
language server, under its MIT license. The rest were added by hand.

<!--- @@inject: ../../static/requirements.md#values-file=:../../static/engines.json&values-file=:cspell-ext.json --->

<!--- @@inject: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Sources

<!--- @@inject: ./static/sources.csv#markdown --->

## License

MIT

The sources keep their own licenses, listed in [Sources](#sources).

<!--- @@inject: ../../static/footer.md --->
