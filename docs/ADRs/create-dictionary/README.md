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

## Out of scope

- To be filled in.

## Decisions

| #   | Title | Status |
| --- | ----- | ------ |
