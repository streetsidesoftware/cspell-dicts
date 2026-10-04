# 0006. A static sample of words tests a new dictionary

Status: Accepted

## Context

A new dictionary's `test` script ran the start of its source through cspell:

```json
"test": "head -n 1000 \"src/<name>.txt\" | cspell -c ./cspell-ext.json \"--locale=<locale>\" \"--languageId=<languageId>\" stdin"
```

It's a smoke test: did the dictionary build, does `cspell-ext.json` reference the files in `dict/` correctly, and can
cspell use it. Any list of words the dictionary contains would do; the source was simply the quickest list to grab.
With several sources, `src/additional_words.txt`, and `src/exclude_words.txt`, reading the source fails in ways that
have nothing to do with the dictionary:

1. Comment lines in the source are checked as words, and can be flagged.
2. A source word listed in `src/exclude_words.txt` is flagged, by design.
3. `head` doesn't exist on Windows.
4. Which source is "first" isn't defined once sources come from both positional arguments and `--define-source`.
5. A dictionary that starts empty only has its header line to check.

Reading words back from `dict/` would avoid most of these, but it tests the build with its own output. About 40
dictionaries already test with static files in `samples/`, checked by `cspell samples` through a `cspell.json` that
imports `./cspell-ext.json`. `cpp`'s `samples/cpp.txt`, for example, is a word list.

## Decision

We will test a new dictionary with a static sample: `samples/sample-words-in-dictionary.txt`.

- The generator writes it once, at creation, from the first few dozen words of the sources, skipping comments and
  blank lines. It isn't regenerated; a maintainer edits it like any sample.
- The dictionary's `cspell.json` gets an override so the sample is checked with the dictionary's locale and file type:

  ```json
  "overrides": [
      {
          "filename": "samples/sample-words-in-dictionary.txt",
          "language": "<locale>",
          "languageId": "<languageId>"
      }
  ]
  ```

  In an override, cspell names the locale `language`; `locale` exists only in `languageSettings`.

- The `test` script runs `cspell samples`.

## Consequences

- The test checks the three things it's for, and none of the five failures above apply. It runs the same on Windows.
- It's how existing dictionaries with samples already test, so `samples/` exists from the start, and the samples stage
  adds real files of the dictionary's type to it.
- A dictionary that starts empty gets an empty sample, so its test checks nothing until words are added.
- If a word in the sample is later excluded or removed, the test fails until the sample is edited.
