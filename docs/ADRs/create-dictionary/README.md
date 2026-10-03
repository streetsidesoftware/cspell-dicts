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

- To be filled in.

## Goal

To be filled in.

## Out of scope

- To be filled in.

## Decisions

| #   | Title | Status |
| --- | ----- | ------ |
