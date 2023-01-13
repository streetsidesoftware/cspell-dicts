# Natural Language Dictionaries

## Improving Suggestions

The spell checker uses a weighted edit distance calculation to derive the list of suggestions.

The list presented to the user are the ones with the lowest cost.

The basic cost of substituting one letter for another is 100. Letters not in the alphabet are slightly more expensive.

To improve suggestions, it is necessary to tell the spell checker a few things:

1. The Locale - this is used for adding / removing accents and capitalization.
2. The letters of the alphabet.
3. The suggested edit costs.

### Edit costs

In English, Great and Grateful both have the `ate` sound. But if someone misspelled Grateful as `Greatful`, the edit cost is 200 -- remove the `e` before `a` (100) and add it back after `t` (100). Since this is a common type of mistake in English, we might want to make the substitution cheaper so it appears higher in the list.

```yaml
map: (eat)(ate)
replace: 75
```

**Before**

`cspell suggest greatful -v`

<img width="283" alt="image" src="https://user-images.githubusercontent.com/3740137/212286136-98093f0e-497d-4507-8f31-97ae3bb2aa8c.png">

**After**

`cspell suggest greatful -v -d en_us`

<img width="232" alt="image" src="https://user-images.githubusercontent.com/3740137/212286776-4186e0ca-9ef2-4e6e-9b3b-181246855729.png">

### Matching the Beginning and End of Words

- `^` - matches the begging of a word
- `$` - matches the end of a word

```yaml
description: Do not rank `'s` high on the list.
map: >-
  ($)('$)('s$)|(s$)(s'$)(s's$)
replace: 10
penalty: 180
```

#### Example: Dutch

Example of the [Dutch Substitution Costs](https://github.com/streetsidesoftware/cspell-dicts/blob/70ac688381f36f62b7ea631720272cf404b4bc9e/dictionaries/nl_NL/cspell-ext.json#L12-L38)

```json
"dictionaryInformation": {
    "locale": "nl-NL",
    "alphabet": "a-zA-Zëqïéèöêüçàûîñäô",
    "suggestionEditCosts": [
        {
            "map": "o(oo)|e(ee)|u(uu)|a(aa)|(ei)(ie)|(ou)(ui)|(ei)(ij)(ĳ)",
            "replace": 50
        },
        {
            "map": "s(ss)|e(en)|n(nen)",
            "replace": 75
        },
        {
            "map": "eéèëê|aáà|iíìïî|oóòöô|uüúùû|(ij)(ĳ)(IJ)(Ĳ)",
            "replace": 1
        },
        {
            "map": "(er)(ër)|(kju)(cue)|(oren)(oors)|(eck)(eque)|(ore)(oire)|(oor)(oir)|ü(ue)",
            "replace": 75
        },
        {
            "map": "(en)(nen)(s)",
            "description": "Words are compounded in plural form",
            "insDel": 90
        }
    ]
}
```

<!---
cspell:ignore greatful
cspell:ignore Zëqïéèöêüçàûîñäô eéèëê iíìïî oóòöô uüúùû oors eque oire
--->

The docs are a bit lacking, but here is a good place to start:

- [DictionaryInformation](https://cspell.org/types/cspell-types/interfaces/DictionaryInformation/)
- [Suggestion Cost Map](https://cspell.org/types/cspell-types/modules/#suggestioncostmapdef)
