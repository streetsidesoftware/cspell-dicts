# Create Dictionary

How `pnpm create-dictionary` creates a dictionary package: its options, the sources it accepts, and what the new
dictionary contains. It needed design decisions because what it writes is what every new dictionary starts from.

## Why

- **Dictionaries are compiled from several source files into one published dictionary.** Programming language
  dictionaries are mostly sets of text files in `src/`, with nested folders for `legacy` lists, third-party sources, and
  anything that needs its own `README.md` or license. Natural language dictionaries mostly come from an upstream source,
  such as OpenOffice or another Hunspell dictionary, published on npm, kept in a repository, or only offered on a
  download page.
- **A compiled dictionary is often a derivative work of its sources,** so where each source comes from has to be
  traceable, Hunspell files above all.
- **Every source needs a local copy in the dictionary package.** An upstream source can be moved, removed, or changed in a way we
  can't use. A sync step keeps the copies up to date where possible, and a missing upstream source must never break a
  dictionary.
- **Maintainers clean up after every new dictionary.** `create-dictionary` takes one local file, so the sync setup, the
  record of where sources came from, and other fixes are done by hand after a contributor opens the PR, and that takes a
  maintainer a lot of time.
- **New dictionaries arrive without samples.** Contributors run the generator and stop there, and the generator creates
  no `samples/`.
- **Why now:** `create-dictionary` runs without prompts since #5841, so agents now create dictionaries too. Reviewing its
  options after the rewrite (#5841–#5845) showed these gaps.

## Stakeholders

- **Contributors adding a dictionary:** they get a dictionary package with its sources, their origin, the sync step,
  and a place for samples already set up, so less of their PR has to be redone.
- **Agents creating dictionaries** (the `new-dictionary` skill): one command sets up what they now patch by hand, the
  same way every time.
- **Maintainers:** less cleanup after each new dictionary, and every source traceable to where it came from.
- **cspell users:** indirectly. Dictionaries keep building when an upstream source disappears, and their licenses stay
  correct.
- **Upstream projects:** their files are credited, with their license kept next to the copy.

## Goal

A contributor or an agent runs `pnpm create-dictionary` once and gets a dictionary package a maintainer can merge
without cleanup:

- every source has a local copy in `src/`, with a record of where it came from and its license
- each upstream source has a working sync step
- there's a `src/additional_words.txt` for words added by hand
- there's a `samples/` folder, with a test that checks it

That's the end state. It ships in stages, each usable on its own:

1. **Sources:** several sources, each with a local copy in `src/` and a record of where it came from, plus
   `src/additional_words.txt`.
2. **Sync:** a sync step for sources from npm or GitHub. It writes into the layout from stage 1, and saves maintainers
   the most cleanup.
3. **Samples:** real files of the dictionary's type in `samples/`. Stage 1 already creates `samples/` with a static
   word sample ([0009](./0009-a-static-sample-replaces-the-source-test.md)).

## Out of scope

- **Existing dictionaries.** Moving them to the new layout is tracked in #5836.
- **The shared words-check script** that replaces the template's `head -n 1000` test, also in #5836. The generator
  uses it once it exists.
- **Deciding licenses.** The generator records each source's license and where it came from; whether a license fits
  stays a person's decision.
- **Writing samples.** The generator creates `samples/` and the test that checks it; the sample files come from the
  contributor.
- **Setting up more complex dictionaries,** such as guarded splitting (`split` with `allowedSplitWords`) for large lists
  of code terms. The generator focuses on creating the initial dictionary; editing a complex one can come later, in it
  or another tool.
- **Tuning a Hunspell dictionary's depth.** The generator sets a safe default
  ([0015](./0015-hunspell-depth.md)); finding the right depth for a language is a later step.
- **Making a dictionary public.** New dictionaries start private, and a maintainer publishes them later.

## Decisions

| #                                                                         | Title                                                                               | Status             |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------ |
| [0001](./0001-name-and-sources-on-the-command-line.md)                    | How the name and the sources are given on the command line                          | Accepted           |
| [0002](./0002-word-lists-and-hunspell-files-mix.md)                       | Word lists and Hunspell files can be mixed in one dictionary                        | Accepted           |
| [0003](./0003-additional-words-file.md)                                   | Every new dictionary gets `src/additional_words.txt`                                | Accepted           |
| [0004](./0004-each-hunspell-source-gets-its-own-folder.md)                | Each Hunspell source gets its own folder in `src/`                                  | Accepted           |
| [0005](./0005-a-folder-source-keeps-only-its-words-license-and-readme.md) | A folder source keeps only its word lists, license, and README                      | Superseded by 0006 |
| [0006](./0006-third-party-sources-are-defined-by-name.md)                 | Third-party sources are defined by name, with their files, license, README, and URL | Accepted           |
| [0007](./0007-exclude-words-file.md)                                      | Every new dictionary gets `src/exclude_words.txt`                                   | Accepted           |
| [0008](./0008-missing-sources-need-allow-missing-source.md)               | A missing source is an error unless `--allow-missing-source` is given               | Accepted           |
| [0009](./0009-a-static-sample-replaces-the-source-test.md)                | A static sample of words replaces testing the source                                | Accepted           |
| [0010](./0010-friendly-name-and-descriptions.md)                          | The friendly name and the descriptions                                              | Accepted           |
| [0011](./0011-locale-or-file-type-never-both-any.md)                      | A dictionary sets its locale or its file type, never both `*`                       | Accepted           |
| [0012](./0012-when-a-dictionary-is-stored-as-a-trie.md)                   | When a dictionary is stored as a trie                                               | Accepted           |
| [0013](./0013-word-list-dictionaries-are-built-at-creation.md)            | Word-list dictionaries are built at creation; Hunspell ones aren't by default       | Accepted           |
| [0014](./0014-test-options-are-hidden.md)                                 | Options for tests are hidden from `--help`                                          | Accepted           |
| [0015](./0015-hunspell-depth.md)                                          | Hunspell sources default to a depth of 1                                            | Accepted           |
| [0016](./0016-prompting-for-third-party-sources.md)                       | Prompting asks for third-party sources in a loop                                    | Accepted           |
| [0017](./0017-github-sources-follow-the-default-branch.md)                | A GitHub source follows its default branch                                          | Accepted           |
| [0018](./0018-remote-sources-are-fetched-first.md)                        | Remote sources are fetched first, and any failure stops creation                    | Accepted           |
| [0019](./0019-remote-sources-are-npm-and-github.md)                       | Remote sources come from npm or GitHub; download pages are local sources            | Accepted           |
| [0020](./0020-sources-are-recorded-in-a-sources-file.md)                  | A dictionary's sources are recorded in a sources file                               | Accepted           |
| [0021](./0021-sources-are-explained-in-the-readmes.md)                    | Sources are explained in the dictionary's README and in `src/README.md`             | Accepted           |
| [0022](./0022-prefer-the-source-repository-npm-from-a-cdn.md)             | Prefer the source repository; an npm source is read from jsDelivr                   | Accepted           |

## Provisional names

- `--add-source-ref`: the option that pins a GitHub source to a tag or commit. Decide with the rest of the sync stage.
- `sources.yaml`: the sources file. Decide before building the sync stage.
- The generic sync command's name. Decide before building the sync stage.
