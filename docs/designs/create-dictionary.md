# Create Dictionary

<!--
audience: developer, maintainer
kind: reference
level: knows the repo's dictionaries and conventions
-->

> [!NOTE]
> For maintainers and developers who want to know why `pnpm create-dictionary` is shaped the way it is.

**tl;dr:** One run of `pnpm create-dictionary` gives someone who doesn't know the repo a dictionary that passes CI, and
that a maintainer can merge after review.

- Each third-party source gets its own folder, its license beside its copy, and an entry in `src/sources.yaml`.
- Every new dictionary has one known place to add a word and one to remove it.
- Every new dictionary has a description of its words, a locale or language-id that enables it, and samples that test
  it. A language-id refers to the file type, like Python or JavaScript.
- Sources on GitHub or npm are meant to follow upstream through a weekly sync. That part is
  [not built yet](#not-built-yet).

The code and [Creating a dictionary](../guides/new-dictionary.md) are the source of truth for how the tool behaves.

## Why

A new dictionary should be easy to create, easy to adopt, and easy to maintain. Before this design, it wasn't:

- **Hard to create.** The tool took one local file. Everything else depended on conventions a contributor had to know.
- **Hard to adopt.** Maintainers fixed every new dictionary by hand after the PR was opened.
- **Hard to maintain.** Each dictionary set up its sources and word fixes its own way.
- **Not always traceable or tested.** A compiled dictionary is often a derivative work of its sources, but their origin
  and license weren't always recorded. New dictionaries arrived without samples.

Since [#5841](https://github.com/streetsidesoftware/cspell-dicts/pull/5841), the tool runs without prompts, so agents
create dictionaries as well as people. Reviewing its options afterwards showed these gaps.

Two facts about dictionaries shape the design:

- **They're compiled from several source files.** Natural language dictionaries mostly come from an upstream source,
  and others are mostly sets of text files.
- **Every source needs a local copy.** A missing upstream source must never break a dictionary.

### Who it affects

- **Contributors, and agents working for them:** they can create a dictionary without knowing the repo's conventions.
- **Maintainers:** they adopt a new dictionary with little effort, and keep it current with little more.
- **cspell users:** indirectly. Dictionaries keep building when an upstream source disappears, and they're tested
  against real examples.
- **Upstream projects:** their files are credited, with their license next to the copy.

### Goals

1. **Easy to create:** someone who doesn't know the repo gets a dictionary that passes CI from one run. Options,
   prompts, or an AI agent can drive it.
2. **Easy to adopt:** a maintainer merges a new dictionary after review, without pushing their own fixes.
3. **Easy to maintain:** upstream changes arrive in the weekly PR with no hand work. A word is added or removed in one
   known place.
4. **Traceable and tested:** every third-party source is recorded with its license and shown in the README. The
   dictionary is tested, with real samples where possible.

### Out of scope

- **Existing dictionaries.** Moving them to the new layout is tracked in
  [#5836](https://github.com/streetsidesoftware/cspell-dicts/issues/5836).
- **Deciding licenses.** Whether a license fits stays a person's decision.
- **Writing samples.** They come from the contributor.
- **More complex dictionaries,** such as `split` with `allowedSplitWords` for large lists of code terms.
- **Tuning a Hunspell dictionary's depth.** Finding the right depth is a later step.
- **Making a dictionary public.** New dictionaries start private, and a maintainer publishes them later.

## Design

A contributor gives everything at creation, as options or in the prompts. Both produce the same dictionary.

```sh
pnpm create-dictionary en_XX \
  --define-source aoo=./vendor/aoo-mozilla-en-dict \
  --add-source-file "aoo=dicts/en_XX/en_XX.dic" \
  --add-source-license aoo=LICENSE \
  --add-source-url aoo=https://github.com/marcoagpinto/aoo-mozilla-en-dict
```

The source lands in `src/aoo/`, and `src/sources.yaml` records it. The README shows it in a Sources table.

### Several sources on the command line

Many dictionaries mix word lists and Hunspell files, so one command takes all of them. People and the docs use
positional sources, and options read better in scripts. Both work.

A missing source is an error. `--placeholder-word-lists` starts an empty word list instead, since a dictionary's own
list may not exist yet. It has to be asked for: otherwise an agent that forgets its source gets an empty dictionary and
a successful exit. It never covers a Hunspell or third-party file, because someone else made those.

### Third-party sources, one folder each

A third-party source is a set of files someone else maintains. Each gets its own folder, `src/<name>/`, holding only the
files named for it. An early version walked a source's folder and asked about each file. That recorded nothing about
where the source came from.

- **A folder per source.** Existing dictionaries kept Hunspell files in three ways, and only this one fits several
  sources.
- **One value per option.** An option that takes several values swallows the positional sources that follow it.
- **Published with the dictionary.** A source's license and README ship with the dictionary, since it's often a
  derivative work of that source.
- **A shortcut for Hunspell.** A positional Hunspell file joins the source `hunspell`. These files often have names like
  `index.dic`, and a nested folder keeps people from editing them by hand.
- **Warnings, not errors.** A missing license, README, or URL is only a warning, since not every source has one.

The cost is long commands for natural language dictionaries. Agents write them, and people can use the prompts.

### One record of every third-party source: `src/sources.yaml`

The tool, the sync, and the READMEs all need the same facts about a source. A sync script per source was hard to
maintain, and no other tool can read a command line.

```yaml
sources:
  - name: de
    github: wooorm/dictionaries/dictionaries/de
    files:
      - index.dic
      - index.aff
    license: license
    readme: readme.md
```

- **People edit it, and no tool rewrites it.** It's YAML, which can hold the comment that says what the file is.
- **It names exact files.** A pattern could pull very large files, or files nobody reviewed, into the repo through a bot
  PR that's merged on trust.
- **A local source records its URL,** not the path it was copied from. That path means nothing to anyone else.
- **It isn't published.** Its readers are the repo's tools. Users see the sources in the README.
- **It has no schema.** Tools report a clear error when something they need is missing. A schema could be added later if
  it becomes useful.

### One place to add a word, one to remove it

Every new dictionary gets `src/additional_words.txt` and `src/exclude_words.txt`. Each can be left out with an option.

- **Adding a word.** With several sources, a later visitor can't tell which one a missing word belongs in. A catch-all
  gives them one obvious place.
- **Removing a word.** Excluding is the only lasting way to remove an upstream word, because the next sync undoes an
  edit to the copy.
- **In every dictionary.** One that starts with a single source tends to gain more, and the guide's instruction
  shouldn't depend on the dictionary.

### Names and descriptions

The old defaults had to be corrected in every new dictionary.

- **Friendly name.** It comes from the locale when the name is one, as `en_AU` gives "Australian English". Any other
  name splits at `-` and `_`.
- **`--description`.** It says what words the dictionary covers. It's required, because the old default said nothing
  about them. Only a name that is a locale gives a default.
- **`--package-description`.** npm's description is separate, and keeps "for cspell". There, it tells someone searching
  npm what the package is for.

### Enabled for a locale or a file type

A dictionary needs a locale or a language-id. The tool will attempt to derive the locale from the dictionary name if
neither is given. A natural language dictionary sets the locale, and any other sets the file type.

- `*` is used to indicate any locale or any file type. It is the default.
- Both locale and language-id should not be `*` at the same time.

A dictionary that should be always enabled is a maintainer's design decision.

The tool doesn't create global dictionaries yet.

### Contributors and keywords

Both are optional and repeatable. The prompt suggests the Git name without the email, because an
email is often personal and `package.json` is published.

### How a new dictionary is built

The contributor shouldn't need to know the build, and creating a dictionary should never hang.

- **Trie** when a source is a Hunspell file, or the word lists add up to more than about 1 MB. That size is only a
  starting point.
- **Build at creation** only when all sources are word lists, which take seconds. An early version built every
  dictionary, but a `hu_HU`-sized one waits over 15 minutes or runs out of memory. So a Hunspell dictionary's tests fail
  until its first build, the one exception to passing CI from one run.
- **Depth** limits how many affix rules are chained onto a Hunspell word. It's 1 for now.

The effect of depth can't be predicted, which is why the default is low:

- `nl_NL`: 788 thousand words at depth 1, 804 thousand at depth 2, no change from depth 3, all in about 5 seconds.
- `eu`: 3.9 million words at depth 1, in 22 seconds and 1.7 GB. Depth 2 didn't finish in 15 minutes.
- `hu_HU`: depth 1 didn't finish in 15 minutes.
- `he`: even depth 1 is too much, so it uses 0.

The cost is that a natural language dictionary may miss forms that need two chained rules until a maintainer raises the
depth. We read
[Hunspell's manual](https://github.com/hunspell/hunspell/blob/7d725f1929a4189a3b8188649af6a6b3e302f469/man/hunspell.5#L985-L988)
as a limit of three chained rules, so depth 3 is the likely upper bound.

### Samples test a new dictionary

All samples live in `samples/`, and one `cspell samples` checks them. Real examples show whether the file type enables
the dictionary, and whether words as they're really written are covered.

- **Real samples are encouraged, not required.** Requiring them would work against easy to create. Without any, the tool
  warns.
- **A static word sample, always,** so a dictionary with no real samples still has a test.
- **Each sample is traceable.** `samples/sample-sources.csv` lists its source and license, since samples are in the
  repository.
- **Natural languages get real prose.** The tool fetches the start of the Wikipedia article on Seattle in the locale's
  language, so samples are comparable across languages.

### Sources in the README

Users need to see where a dictionary's words came from and under which licenses. A generated table in the README shows
them, so nobody maintains the list by hand.

### Options for tests are hidden

The tests need `--root` and `--skip-install`, and they call the command the way a user does. The options are hidden from
`--help`, which shows only what someone creating a dictionary needs.

### Remote sources follow their latest

Sources should stay current with no bumping by hand. Pins go stale: `en-common-misspellings` sat at `typos` `v1.33.1`
while `typos` reached `v1.50.3`.

- **GitHub,** whenever an upstream has a repository. A source follows the default branch, because of 9 GitHub
  repositories synced, 5 have no releases. Releases don't always track the words either.
- **npm,** when there's no usable repository. Files are read from jsDelivr, so there's no dependency to install. It has
  several CDN providers behind it and a documented API for listing a package's files.
- **For now, anything else** is downloaded by hand and defined as a local source. Other kinds could be added later.

Following a branch doesn't let changes in without review: every source has a local copy, and changes arrive in a PR.

### How the sync handles upstream change

The weekly sync should bring upstream changes in on its own, and report anything a maintainer must act on, once.

- **Stored identifiers.** A state file in each source's folder holds what the upstream returned for each file. The sync
  compares those and never calculates them, so it doesn't depend on how the upstream calculates them.
- **Gone upstream.** The sync keeps the local copy, because deleting it would lose words on the next build. It notes the
  change once. Failing instead would repeat the same error every week, and hold back every other dictionary.
- **Size cap.** For now, a file over 30 MB keeps its old copy and is noted once. The largest committed source was about
  21 MB, and GitHub warns at 50 MB. `max-size` on a source raises the cap.

### When sources are fetched

Creating a dictionary should succeed with every source or leave nothing behind. One failing source should never hold
back another dictionary's update.

- **At creation, before anything is written.** If a fetch fails, creation stops. It needs a GitHub token, because the
  public API's limit of 60 requests an hour fails confusingly on larger repositories.
- **Afterwards, weekly for now.** Upstream changes arrive together in one PR.
- **One failure doesn't hold back the rest.** The PR opens with whatever synced, and the run is marked failed. The
  dictionaries that failed catch up the next week.

## Not built yet

Everything above is built, except these parts of the last three sections:

- Sources defined by GitHub repository or npm package at creation, and fetched before anything is written.
- The one sync command that reads `src/sources.yaml`, with npm sources through jsDelivr.
- In the sync of a GitHub source: the check that a file exists locally, notes on gone files, the size cap, and files
  whose local path differs from their upstream path.
- A weekly update for new dictionaries, and Update Dictionaries carrying on past a dictionary that fails.

<!-- cspell:ignore marcoagpinto wooorm -->
