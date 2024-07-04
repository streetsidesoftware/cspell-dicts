# US Census Data

Source:
- https://www.census.gov/topics/population/genealogy/data.html

This directory contains the data and the script to extract the names.

The script does three things:

1. Filters the names based upon the % of population. The 80/20 rule works in this case. ~20% of the names represents 80% of the population.
1. Looks up common forms of the name using English Word Frequency data.
1. Adjusts the case of the name to be title case.

For examples:

- `DIAZ` becomes `Diaz` and `Díaz`.
- `OBRIAN` becomes `O'Brian`.

Generate the list:

```sh
node extract-names.mjs
```
