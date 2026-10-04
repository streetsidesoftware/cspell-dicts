# 0007. Samples test a new dictionary: real examples where possible, and a static word sample

Status: Accepted

## Why

**Goals:** tested, and easy to adopt. Every new dictionary has a test that shows it works, and real examples that check
the assumptions made when it was created.

**Problem:** The template's test reads the start of the source, which breaks once a dictionary has several sources, and
a word list can't show whether the dictionary is enabled for the right files.

## Decision

All samples live in `samples/` and are checked by one `cspell samples`, the `test` script.

- **Real samples, encouraged.** `--add-sample <path>`, repeatable, copies a file into `samples/` under its own name.
  The prompt asks "Add a sample file?" until the answer is no. Without any, the generator warns and says why they
  matter; the new-dictionary guide and skill ask for them.
- **Origins.** `--add-sample-origin <file>=<url or text>` gives a sample's origin, and the prompt asks for each. The
  generator writes `samples/README.md` once, listing each sample and its origin, or "no known origin" with a warning.
  After that it's edited by hand.
- **Natural language.** Real prose, as `.md`. The generator suggests the Wikipedia article on Seattle for the locale,
  without fetching it; its link is the origin.
- **File types.** `samples/cspell.json` imports `../cspell-ext.json`, so each real sample is checked under its own file
  type.
- **Static word sample, always.** The generator writes `samples/sample-words-in-dictionary.txt` once, from the first few
  dozen words of the sources, skipping comments and blank lines. The dictionary's `cspell.json` checks it with the
  dictionary's locale and file type:

  ```json
  "overrides": [
      {
          "filename": "samples/sample-words-in-dictionary.txt",
          "language": "<locale>",
          "languageId": "<languageId>"
      }
  ]
  ```

  In an override, cspell names the locale `language`.

## Consequences

- Every new dictionary has a test that runs the same on Windows.
- Real samples break when an assumption made at creation is wrong, and are traceable like sources.
- Natural language samples are comparable across languages.
- An empty dictionary's tests check nothing until words or samples are added.
- A sample word that's later excluded fails the test until the sample is edited.

## Context

A new dictionary's `test` script ran the start of its source through cspell:

```json
"test": "head -n 1000 \"src/<name>.txt\" | cspell -c ./cspell-ext.json \"--locale=<locale>\" \"--languageId=<languageId>\" stdin"
```

It's a smoke test: did the dictionary build, does `cspell-ext.json` reference `dict/` correctly, and can cspell use it.
The source was simply the quickest list of words to grab. With several sources and the word files of
[0004](./0004-additional-and-exclude-words.md), it fails for reasons unrelated to the dictionary:

1. Comment lines in the source are checked as words, and can be flagged.
2. A source word listed in `src/exclude_words.txt` is flagged, by design.
3. `head` doesn't exist on Windows.
4. Which source is "first" isn't defined once sources come from several options.
5. A dictionary that starts empty has only its header line to check.

A smoke test also can't check the assumptions made at creation: whether the file type enables the dictionary, whether
words as they're really written are covered (compounds, casing, identifiers), and whether splitting and depth are right.
Real examples can. 86 of 136 dictionaries have a `samples/` folder, checked by `cspell samples`. `matlab` is the model:
five real `.m` scripts, a `samples/cspell.json` that imports `../cspell-ext.json`, and a `samples/README.md` giving
each sample's origin, such as the `fft` page of the MATLAB documentation, or "no known origin". 31 natural language
dictionaries have `samples/seattle.md`: the Wikipedia article on Seattle in their language, with its link at the top.

## Rejected approaches

- Requiring real samples, failing creation without one: works against easy to create. Not mentioning them: the gap
  goes unnoticed.
- Recording samples in `sources.yaml`: samples don't sync, so most of that machinery doesn't apply.
- Fetching the Wikipedia article: needs the network, the text changes over time, and it's CC BY-SA.
- Reading words back from `dict/`: tests the build with its own output.
- Real samples only, with no static word sample: a dictionary without them would have no test.
