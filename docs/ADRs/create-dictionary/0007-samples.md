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
  The prompt asks for sample files until the answer is empty. Without any, the generator warns and says why they
  matter; the new-dictionary guide and skill ask for them.
- **Sources and licenses.** `--add-sample-origin <file>=<url or text>` gives a sample's source, and
  `--add-sample-license <file>=<license>` its license; the prompt asks for both. `samples/sample-sources.csv` lists each
  sample: a link to its file, its source, the day it was added, and its license, or `unknown`. A GitHub file URL is
  named by its repository and path, with the URL in angle brackets:
  `[github.com/vim/vim: runtime/defaults.vim](<https://github.com/vim/vim/blob/<sha>/runtime/defaults.vim>)`. Any
  other source is kept as given. `samples/README.md` has a title, a line on what `pnpm test` does, and the list as a
  table, injected with `@@inject: sample-sources.csv#markdown`. `add-samples` adds samples later, and adds rows.
- **Natural language.** Real prose, as `.md`. The generator fetches the start of the Wikipedia article on Seattle in
  the locale's language, its lead section as plain text, into `samples/seattle.md`; its source is a link,
  `[en.wikipedia.org: Seattle](<…>)`, to the current article, and its license CC BY-SA 4.0. It finds the article through the English article's language links, since its title differs by language.
  `--no-wikipedia-sample` skips it. Without a network connection it's left out, and isn't an error. Samples aren't
  published, but they are in the repository, so the license is recorded with the link.
- **File types.** `samples/cspell.json` imports `../cspell-ext.json`, so each real sample is checked under its own file
  type.
- **Static word sample, always.** The generator writes `samples/sample-words-in-dictionary.txt` once, from the first few
  dozen words of the sources, skipping comments and blank lines. `sample-sources.csv` lists it like any other sample:
  its source is "Words from this dictionary's sources", under "The sources' licenses". The dictionary's `cspell.json`
  checks it with the dictionary's locale and file type:

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

Adding samples to the vim dictionary, in cspell-dicts#5957, showed three problems in what `add-samples` wrote:

1. A GitHub source given as a URL at a commit showed as the raw URL, 40-character SHA and all, which made the table's
   Source column unusable.
2. The README it started said `sample-words-in-dictionary.txt` holds words from the sources. Only a new dictionary has
   that file, so the vim README described a file that wasn't there.
3. A link written without angle brackets ends at the first unbalanced `)` in its URL. inject-markdown then writes the
   rest as plain text. With angle brackets it reads the whole URL, and writes it into the table with the `)` escaped.

## Rejected approaches

- Requiring real samples, failing creation without one: works against easy to create. Not mentioning them: the gap
  goes unnoticed.
- Recording samples in `sources.yaml`: samples don't sync, so most of that machinery doesn't apply.
- Only suggesting the Wikipedia article, without fetching it: a contributor has to copy it from the browser, and a
  link built from "Seattle" is wrong where the title is in another script, such as Hebrew.
- Reading words back from `dict/`: tests the build with its own output.
- Real samples only, with no static word sample: a dictionary without them would have no test.
- A source as given, such as a GitHub URL at a commit: unreadable in the table.
- Naming a GitHub link by its URL without the commit, such as `https://github.com/vim/vim/runtime/defaults.vim`: it
  looks like a URL, but returns 404.
- Naming a Wikipedia link `Wikipedia: Seattle`: it doesn't match the GitHub links, which name the site.
- Linking a Wikipedia sample to the version it was copied from, with `?oldid=`: the article's link keeps working, its
  history is a click away, and samples are never compared with their source.
- Explaining the samples in the README: that the word sample holds words from the sources, and that a Wikipedia
  sample is the start of the article. It described a file most dictionaries don't have, and each sample says what it
  is in its own row.

<!-- cspell:ignore oldid -->
