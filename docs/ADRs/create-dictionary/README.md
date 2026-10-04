# Create Dictionary

How `pnpm create-dictionary` creates a dictionary package: its options, the sources it accepts, and what the new
dictionary contains. It needed design decisions because what it writes is what every new dictionary starts from.

## Why

We want to make it easy for contributors to create new dictionaries that can be adopted with little effort from
maintainers. A new dictionary should also be easy to maintain into the future.

Today none of that holds:

- **Hard to create.** `create-dictionary` takes one local file. Everything else a dictionary needs, such as its other
  sources, where they came from, a sync, samples, a description, and where it's turned on, depends on conventions a
  contributor has to know.
- **Hard to adopt.** Maintainers fix every new dictionary by hand after the PR is opened: the sync setup, the record of
  where sources came from, descriptions, and defaults. That takes a lot of a maintainer's time.
- **Hard to maintain.** Each dictionary sets up its sources and word fixes its own way: a script per upstream source,
  upstream packages as devDependencies, and three names for the file of excluded words.
- **Not always traceable or tested.** A compiled dictionary is often a derivative work of its sources, but where a
  source came from and its license aren't always recorded. New dictionaries arrive without samples.

The design has to respect how dictionaries work:

- **Dictionaries are compiled from several source files.** Programming language dictionaries are mostly sets of text
  files in `src/`. Natural language dictionaries mostly come from an upstream source, such as OpenOffice or another
  Hunspell dictionary, published on npm, kept in a repository, or only offered on a download page.
- **Every source needs a local copy in the dictionary package.** An upstream source can be moved, removed, or changed in
  a way we can't use, and a missing upstream source must never break a dictionary.

**Why now:** `create-dictionary` runs without prompts since #5841, so agents now create dictionaries as well as people.
Reviewing its options after the rewrite (#5841–#5845) showed these gaps.

## Stakeholders

- **Contributors, and agents working for them:** they can create a dictionary without knowing the repo's conventions,
  and less of their PR has to be redone.
- **Maintainers:** they adopt a new dictionary with little effort, and keep it current with little more.
- **cspell users:** indirectly. Dictionaries keep building when an upstream source disappears, and they're tested
  against real examples.
- **Upstream projects:** their files are credited, with their license kept next to the copy.

## Goal

Three goals form the main line, and a fourth applies to all of them:

1. **Easy to create:** someone who doesn't know the repo gets a dictionary that passes CI from one run of
   `pnpm create-dictionary`, with options or by answering the prompts. Or their AI agent walks them through it, so they
   never need to type a terminal command.
2. **Easy to adopt:** a maintainer merges a new dictionary after review, without pushing their own fixes to the PR.
3. **Easy to maintain:** upstream changes arrive in the weekly PR with no hand work, and a word is added or removed in
   one known place.
4. **Traceable and tested:** every source is recorded with its license and shown in the README, and the dictionary is
   tested, with real samples where possible.

It ships in two stages, each usable on its own:

1. **Create and adopt:** everything the generator writes: the sources and their record, the word files, the defaults,
   the samples, and the READMEs.
2. **Maintain:** remote sources and the weekly sync.

## Out of scope

- **Existing dictionaries.** Moving them to the new layout is tracked in #5836.
- **The shared words-check script** that replaces the template's `head -n 1000` test, also in #5836. The generator
  uses it once it exists.
- **Deciding licenses.** The generator records each source's license and where it came from; whether a license fits
  stays a person's decision.
- **Writing samples.** The generator copies the samples it's given, records where they came from, and warns when there
  are none; the samples themselves come from the contributor.
- **Setting up more complex dictionaries,** such as guarded splitting (`split` with `allowedSplitWords`) for large lists
  of code terms. The generator focuses on creating the initial dictionary; editing a complex one can come later, in it
  or another tool.
- **Tuning a Hunspell dictionary's depth.** The generator sets a safe default
  ([0006](./0006-how-a-new-dictionary-is-built.md)); finding the right depth for a language is a later step.
- **Making a dictionary public.** New dictionaries start private, and a maintainer publishes them later.

## Decisions

### Stage 1: Create and adopt

| #                                                       | Title                                                                                 | Status   |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------- |
| [0001](./0001-name-and-sources-on-the-command-line.md)  | How the name and the sources are given on the command line                            | Accepted |
| [0002](./0002-third-party-sources.md)                   | Third-party sources are defined by name, each in its own folder                       | Accepted |
| [0003](./0003-sources-file.md)                          | Every source is recorded in `src/sources.yaml`                                        | Accepted |
| [0004](./0004-additional-and-exclude-words.md)          | Every new dictionary gets `src/additional_words.txt` and `src/exclude_words.txt`      | Accepted |
| [0005](./0005-names-descriptions-and-where-it-is-on.md) | The friendly name, the descriptions, and where a dictionary is turned on              | Accepted |
| [0006](./0006-how-a-new-dictionary-is-built.md)         | How a new dictionary is built: trie, build at creation, and Hunspell depth            | Accepted |
| [0007](./0007-samples.md)                               | Samples test a new dictionary: real examples where possible, and a static word sample | Accepted |
| [0008](./0008-sources-are-explained-in-the-readmes.md)  | Sources are explained in the dictionary's README and in `src/README.md`               | Accepted |
| [0009](./0009-test-options-are-hidden.md)               | Options for tests are hidden from `--help`                                            | Accepted |

### Stage 2: Maintain

| #                                             | Title                                                           | Status   |
| --------------------------------------------- | --------------------------------------------------------------- | -------- |
| [0010](./0010-remote-sources.md)              | Remote sources come from GitHub or npm, and follow their latest | Accepted |
| [0011](./0011-how-the-sync-handles-change.md) | How the sync handles upstream change                            | Accepted |
| [0012](./0012-when-sources-are-fetched.md)    | When sources are fetched: all at once at creation, then weekly  | Accepted |

## Build order

One PR per step. This section is removed once the feature ships.

1. Names, descriptions, and the locale or file type; hidden test options ([0005](./0005-names-descriptions-and-where-it-is-on.md), [0009](./0009-test-options-are-hidden.md)).
2. Several sources and `--allow-missing-source` ([0001](./0001-name-and-sources-on-the-command-line.md)).
3. `src/additional_words.txt` and `src/exclude_words.txt` ([0004](./0004-additional-and-exclude-words.md)).
4. Third-party sources and `sources.yaml`, together ([0002](./0002-third-party-sources.md), [0003](./0003-sources-file.md)).
5. Trie, build at creation, and Hunspell depth ([0006](./0006-how-a-new-dictionary-is-built.md)).
6. Samples ([0007](./0007-samples.md)).
7. Sources in the READMEs, mostly in `scripts/` ([0008](./0008-sources-are-explained-in-the-readmes.md)).
8. `sync-sources`, and in `sync-github-files` the existence check, gone marks, size cap, and differing local paths ([0011](./0011-how-the-sync-handles-change.md)).
9. npm sources through jsDelivr ([0010](./0010-remote-sources.md)).
10. Remote sources at creation, the weekly `update-dictionary` script, and `--no-bail` in Update Dictionaries ([0010](./0010-remote-sources.md), [0012](./0012-when-sources-are-fetched.md)).
