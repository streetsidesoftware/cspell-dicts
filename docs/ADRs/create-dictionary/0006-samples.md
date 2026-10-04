# 0006. Samples test a new dictionary: real examples where possible, and a static word sample

Status: Accepted

## Context

A new dictionary's `test` script ran the start of its source through cspell:

```json
"test": "head -n 1000 \"src/<name>.txt\" | cspell -c ./cspell-ext.json \"--locale=<locale>\" \"--languageId=<languageId>\" stdin"
```

That's a smoke test: did the dictionary build, does `cspell-ext.json` reference the files in `dict/` correctly, and can
cspell use it. With several sources, `src/additional_words.txt`, and `src/exclude_words.txt`, reading the source fails
in ways that have nothing to do with the dictionary: comment lines are checked as words, a word listed in
`src/exclude_words.txt` is flagged by design, `head` doesn't exist on Windows, which source is "first" isn't defined, and
a dictionary that starts empty has only its header line to check. Reading words back from `dict/` would test the build
with its own output.

A smoke test also can't check the assumptions made when the dictionary was created: whether the file type turns it on,
whether words as they're really written are covered (compounds, casing, identifiers), and whether the build's splitting
and depth are right. Real examples can. 86 of 136 dictionaries have a `samples/` folder, checked by `cspell samples`.
`matlab` is the model: five `.m` scripts, a `samples/cspell.json` that imports `../cspell-ext.json`, and a
`samples/README.md` that traces each sample to where it came from, or says "no known origin". For natural language
dictionaries, 31 have a `samples/seattle.md`: the Wikipedia article on Seattle in that language, with its link at the
top.

Options weighed:

- Require real samples, failing creation without one unless `--no-samples` is given. That works against "easy to
  create".
- Make them optional with no warning, so the gap goes unnoticed.
- Add samples only by hand after creation, or only through options.
- Record samples in `sources.yaml` and generate their README section. Samples don't sync, so most of that machinery
  doesn't apply.
- Have the generator fetch the Wikipedia article. It needs the network, the article changes over time, and the text is
  CC BY-SA, which calls for attribution.
- Use real samples only, and drop the static word sample when they're given.

## Decision

We will test a new dictionary with samples in `samples/`, all checked by one `cspell samples` run:

- **Real samples, encouraged.** `--add-sample <path>` is repeatable, and copies each file into `samples/` under its own
  name. When prompting, the generator asks "Add a sample file?" in a loop. Creation works without real samples, but the
  generator warns that there are none and says why they matter; the new-dictionary guide and skill ask for them, and a
  maintainer can insist before merging.
- **Each sample's origin is recorded.** The generator writes `samples/README.md` once, listing each sample with its
  origin from `--add-sample-origin <file>=<url or text>`. A missing origin is written as "no known origin", with a
  warning, and the prompt asks for each sample's origin. After creation the README is edited by hand.
- **Natural language samples are real prose,** as `.md`, following the Seattle convention: the generator suggests the
  Wikipedia article on Seattle for the dictionary's locale, but doesn't fetch it. The contributor adds the text with
  `--add-sample`, and the article's link is its origin. Other prose is welcome too.
- **A static word sample, always.** The generator writes `samples/sample-words-in-dictionary.txt` once, from the first
  few dozen words of the sources, skipping comments and blank lines. A maintainer edits it like any sample. The
  dictionary's `cspell.json` gets an override so it's checked with the dictionary's locale and file type:

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

- **Real samples are checked under their own file type,** through a `samples/cspell.json` that imports
  `../cspell-ext.json`, as in `matlab`.
- **The `test` script runs `cspell samples`.**

## Consequences

- Every new dictionary has a test that runs the same on Windows, and none of the source-reading failures apply.
- Real samples check the assumptions made at creation, and break when one is wrong.
- Samples are traceable the way sources are, through `samples/README.md`.
- Natural language samples stay comparable across languages.
- A dictionary that starts empty gets an empty word sample, so its test checks nothing until words or real samples are
  added.
- If a word in a sample is later excluded or removed, the test fails until the sample is edited.
