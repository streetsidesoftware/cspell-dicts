# Create Dictionary

<!--
audience: developer, maintainer
kind: reference
level: knows the repo's dictionaries and conventions
-->

> [!NOTE]
> For maintainers and developers who want to know why `pnpm create-dictionary` is shaped the way it is.

**tl;dr:** One run of `pnpm create-dictionary` gives someone who doesn't know the repo a dictionary that passes CI, and
that a maintainer can merge after review. Each third-party source gets its own folder, its license beside its copy, and
an entry in `src/sources.yaml`. Every new dictionary has one known place to add a word and one to remove it, a
description of its words, a locale or file type that enables it, and samples that test it. Sources on GitHub or npm are
meant to follow upstream through a weekly sync. That part is designed, but [not built yet](#not-built-yet).

The code and [Creating a dictionary](../guides/new-dictionary.md) are the source of truth for how the tool behaves.

## Why

We want contributors to be able to create a dictionary that maintainers can adopt with little effort, and that stays
easy to maintain. Before this design, none of that held:

- **Hard to create.** The tool took one local file. Everything else a dictionary needs, such as its other sources,
  where they came from, a sync, samples, a description, and when it's enabled, depended on conventions a contributor
  had to know.
- **Hard to adopt.** Maintainers fixed every new dictionary by hand after the PR was opened: the sync setup, the record
  of where sources came from, descriptions, and defaults.
- **Hard to maintain.** Each dictionary set up its sources and word fixes its own way: a script per upstream source,
  upstream packages as devDependencies, and three names for the file of excluded words.
- **Not always traceable or tested.** A compiled dictionary is often a derivative work of its sources, but where a
  source came from and its license weren't always recorded. New dictionaries arrived without samples.

Since [#5841](https://github.com/streetsidesoftware/cspell-dicts/pull/5841), the tool runs without prompts, so agents
create dictionaries as well as people. Reviewing its options afterwards showed these gaps.

Two facts about dictionaries shape the design:

- **They're compiled from several source files.** Programming language dictionaries are mostly sets of text files.
  Natural language dictionaries mostly come from an upstream source, published on npm, kept in a repository, or only
  offered on a download page.
- **Every source needs a local copy.** An upstream source can be moved, removed, or changed in a way we can't use, and
  a missing upstream source must never break a dictionary.

### Who it affects

- **Contributors, and agents working for them:** they can create a dictionary without knowing the repo's conventions,
  and less of their PR has to be redone.
- **Maintainers:** they adopt a new dictionary with little effort, and keep it current with little more.
- **cspell users:** indirectly. Dictionaries keep building when an upstream source disappears, and they're tested
  against real examples.
- **Upstream projects:** their files are credited, with their license kept next to the copy.

### Goals

1. **Easy to create:** someone who doesn't know the repo gets a dictionary that passes CI from one run, with options or
   by answering the prompts. Or their AI agent walks them through it, so they never type a terminal command.
2. **Easy to adopt:** a maintainer merges a new dictionary after review, without pushing their own fixes to the PR.
3. **Easy to maintain:** upstream changes arrive in the weekly PR with no hand work, and a word is added or removed in
   one known place.
4. **Traceable and tested:** every source is recorded with its license and shown in the README, and the dictionary is
   tested, with real samples where possible.

### Out of scope

- **Existing dictionaries.** Moving them to the new layout is tracked in
  [#5836](https://github.com/streetsidesoftware/cspell-dicts/issues/5836).
- **Deciding licenses.** The tool records each source's license. Whether it fits stays a person's decision.
- **Writing samples.** The tool copies the samples it's given and warns when there are none.
- **Setting up more complex dictionaries,** such as `split` with `allowedSplitWords` for large lists of code terms.
  The tool creates the initial dictionary.
- **Tuning a Hunspell dictionary's depth.** The tool sets a low default. Finding the right depth is a later step.
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

The source lands in `src/aoo/`, and `src/sources.yaml` records it. The README shows it in a Sources table. The new
dictionary also gets its word files and samples, and a word-list dictionary arrives built.

### Several sources on the command line

Many dictionaries mix word lists and Hunspell files. `en_AU` is compiled from a Hunspell file, its own additional words,
and shared word lists. So sources can be positional, repeated `--source`, or both, and they can be mixed. The name can
be positional or `--name`. People and the docs use the positional form, and the option form reads better in scripts.

A source that doesn't exist, or giving no source at all, is an error. `--placeholder-word-lists` starts an empty word
list instead, since a dictionary's own list may not exist yet. It never covers a Hunspell or third-party file: someone else made those, so a missing one is a
mistake.

Turned down:

- **One form only:** breaks the habit of either people or scripts.
- **A comma-separated list:** breaks on file names with commas, and no other option works that way.
- **Word lists or one Hunspell pair, not both:** simpler, but rules out dictionaries like `en_AU`.
- **Creating an empty word list unasked:** an agent that forgets its source gets an empty dictionary and a successful
  exit. A reviewer flagged that trap in [#5841](https://github.com/streetsidesoftware/cspell-dicts/pull/5841).

### Third-party sources, one folder each

A third-party source is a set of files someone else maintains. To keep a copy we need its name, its files, and, where
it has them, its license, README, and URL. Each is defined with `--define-source` and the `--add-source-*` options, and
copied into `src/<name>/`, with only the files named for it.

- **Why a folder per source.** Existing dictionaries kept Hunspell files in `src/hunspell/` (32), directly in `src/`
  (15), or in a folder named after the source (about 13). Only the last fits several sources. Upstream sources also
  often have same-named files in different folders.
- **One value per option.** An option that takes several values keeps reading words until the next option, so it
  swallows the positional sources that follow. Where a value needs a source name, the name comes first, followed by
  `=`.
- **Local paths.** A file keeps its path relative to the source. An optional local path puts it elsewhere in the folder,
  for a license kept at the repository's root.
- **Published with the dictionary.** Each source's license and README ship with the dictionary, since it's often a
  derivative work of its sources.
- **Shortcut for Hunspell.** A positional Hunspell file joins the source `hunspell`, as 32 dictionaries keep theirs.
  These files often have names like `index.dic` that make poor source names, and a nested folder keeps people from
  editing them by hand.
- **Checks.** A source needs at least one file, and every named file must exist. A missing license, README, or URL is
  only a warning, since not every source has one. Whether a license fits stays a person's decision.

The cost is long commands for natural language dictionaries. Agents write them, and people can use the prompts.

Turned down:

- **Walking a source's folder and asking about each file:** asks which file is which rather than what the source needs,
  and records nothing about where it came from. An early version did this.
- **A generated README in each source's folder:** collides with the source's own README, repeats the record of sources,
  and can drift from it.

### One record of every source: `src/sources.yaml`

The tool, the sync, and the READMEs all need the same facts about a source. Before this, the only record was a sync
script per source in `package.json`. That's hard to maintain, and no other tool can read a command line.

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

- **People edit it, and no tool rewrites it.**
- **It names exact files.** The build names exact files too, so a renamed upstream file needs a person either way.
- **A local source records its URL,** not where it was copied from on a contributor's machine. That path means nothing
  to anyone else.
- **It isn't published.** Its readers are the repo's tools. Users see the sources in the README.

Turned down:

- **Keeping the scripts:** see above.
- **A field in `package.json`:** npm doesn't know it, it can't hold comments, and a reader can't tell what it is.
- **JSON or JSON5:** JSON can't hold the comment that says what the file is, and `json5` drops comments when it writes
  a file back.
- **Globs or folders in `files:`,** so renamed and new upstream files arrive on their own: a pattern can pull very large
  files, or files nobody reviewed, into the repo through a bot PR that's merged on trust.

### One place to add a word, one to remove it

Every new dictionary gets `src/additional_words.txt` and `src/exclude_words.txt`. A dictionary that must hold only
upstream words leaves one out with `--no-additional-words` or `--no-exclude-words`.

Two fixes come up in almost every dictionary with more than one source. A later visitor can't easily tell which source a
missing word belongs in, so a catch-all gives them one obvious place: 50 dictionaries had added that file by hand, and 8
more used other names. Excluding is the only lasting way to remove an upstream word, since the next sync undoes an edit
to the copy: 10 dictionaries did that, under three names. So the guide couldn't give one instruction.

Turned down:

- **Creating the files only for dictionaries with several sources or a third-party source:** a dictionary that starts
  with one source tends to gain more, and the guide's instruction would depend on the dictionary.

### Names and descriptions

The old defaults had to be corrected in every new dictionary, so:

- **The friendly name** comes from the locale when the name is one (`en_AU` gives "Australian English"). Any other name
  splits at `-` and `_`. It used to split only at `-`, so `medical_terms` became "Medical_terms".
- **`--description` says what words it covers,** and is required, since the old default said nothing. "Azerbaijani
  dictionary for cspell." told a reader of the README nothing about its words. Only a name that is a locale gives a
  default, such as "Australian English dictionary". For anything else, an agent has to write one.
- **`--package-description` is separate.** npm's description keeps "for cspell", because there it tells someone
  searching npm what the package is for.

Turned down:

- **A better generated description:** still generic, and repeated everywhere.
- **Leaving it to reviewers:** that's the hand fixing this design removes.
- **Refusing "for cspell" in `--description`:** the phrase only reached it because one description used to serve both
  places. With them separate, it only gets there if someone types it. Building this showed the check guarded against
  nothing likely.

### Enabled for a locale or a file type

A dictionary sets `--locale` or `--language-id`, so they're never both `*`, which means any. A natural language
dictionary sets the locale, and any other sets the file type. The old default enabled every new dictionary for every file in every language, so users got
its words wherever they spell checked. A dictionary that should be always enabled is a maintainer's design decision.

### Contributors and keywords

`--contributor` lists who creates and maintains the dictionary, and `--keyword` adds other names people search npm for,
such as `golang` for Go. Both are repeatable and optional. Contributors use npm's one-line form, as every dictionary
that lists them does. The prompt suggests the Git name without the email, because an email is often personal and
`package.json` is published.

Turned down:

- **Listing upstream authors:** they're credited through their sources' licenses and READMEs.
- **Separate name, email, and URL options:** awkward for more than one person.
- **A single `--keywords "a,b"`:** no other option takes a list that way.
- **Adding keywords by hand afterwards:** contributors know the search terms while running the tool, and the edit was
  easy to forget.

### How a new dictionary is built

The contributor shouldn't need to know the build, and creating a dictionary should never hang.

- **Trie** when a source is a Hunspell file, or the word lists add up to more than about 1 MB. `--trie` and `--no-trie`
  override it.
- **Build at creation** when all sources are word lists, which take seconds. With a Hunspell source it doesn't build,
  and says how to. A Hunspell dictionary's tests fail until its first build, the one exception to passing CI from one
  run. `--build` and `--no-build` override it.
- **Depth** limits how many affix rules are chained onto a Hunspell word. It's set only on Hunspell sources, at 1,
  since it means nothing on a word list. `--hunspell-depth` changes it.

The effect of depth can't be predicted, which is why the default is low:

- `nl_NL`: 788 thousand words at depth 1, 804 thousand at depth 2, no change from depth 3, all in about 5 seconds.
- `eu`: 3.9 million words at depth 1, in 22 seconds and 1.7 GB. Depth 2 didn't finish in 15 minutes.
- `hu_HU`: depth 1 didn't finish in 15 minutes.
- `he`: even depth 1 is too much, so it uses 0.

The cost is that a natural language dictionary may miss forms that need two chained rules until a maintainer raises the
depth.

Turned down:

- **Leaving the trie to the contributor:** they'd have to know to ask for it.
- **Deciding by rule with no override.**
- **Building every dictionary:** a `hu_HU`-sized one waits over 15 minutes or runs out of memory. An early version did
  this, before these measurements.
- **Building with a time limit:** guesswork across machines.
- **Leaving the depth unset:** the build's default of 5 is far too slow for some languages.

### Samples test a new dictionary

All samples live in `samples/`, and one `cspell samples` checks them. The old test ran the start of the source through
`head`, which Windows doesn't have. It flagged comments and excluded words, and there's no "first" source once there
are several. It also can't show whether the file type enables the dictionary, or whether words as they're really
written are covered. Real examples can, and 86 of 136 dictionaries already had them.

- **Real samples are encouraged.** `--add-sample` copies a file in. Without any, the tool warns and says why they
  matter.
- **A static word sample, always,** so a dictionary with no real samples still has a test.
- **Each sample is traceable.** `samples/sample-sources.csv` lists its source, the day it was added, and its license,
  since samples are in the repository.
- **Natural languages get real prose.** The tool fetches the start of the Wikipedia article on Seattle in the locale's
  language, so samples are comparable across languages. 31 dictionaries already had one. Without a network connection
  it's left out, and isn't an error. `--add-wikipedia-sample` fetches other articles.
- **A GitHub source is named by its repository and path,** linked at its commit. The raw URL, commit SHA and all, made
  the table in `samples/README.md` unusable.

Turned down:

- **Requiring real samples:** works against easy to create. **Not mentioning them:** the gap goes unnoticed.
- **Recording samples in `src/sources.yaml`:** samples don't sync, so most of that machinery doesn't apply.
- **Only suggesting the Wikipedia article:** a contributor has to copy it from the browser, and a link built from
  "Seattle" is wrong where the title is in another script, such as Hebrew.
- **Reading words back from `dict/`:** tests the build with its own output.
- **A GitHub link without the commit:** it looks like a URL, but returns 404.
- **Linking the Wikipedia sample to the version it was copied from:** the article's link keeps working, its history is
  a click away, and samples are never compared with their source.
- **Explaining the samples in the README:** it described a file most dictionaries don't have, and each sample says what
  it is in its own row.

### Sources in the README

Users need to see where a dictionary's words came from and under which licenses. `static/sources.csv` is generated from
`src/sources.yaml`, and both the README and `src/README.md` inject it as a table. The License section says the sources
keep their own licenses.

Turned down:

- **Writing the list into `src/README.md` by hand:** it drifts.
- **Generating the table as Markdown:** the tool would escape and align it itself. As data, inject-markdown, which
  fills the README's `@@inject` sections, makes the table, the same way as `samples/sample-sources.csv`.
- **A list, one entry per source:** harder to compare at a glance.

### Options for tests are hidden

`--root` and `--skip-install` let the tests create dictionaries in a temporary folder without changing
`pnpm-lock.yaml`. They stay, so the tests call the command the way a user does, but they're hidden from `--help`, which
shows only what someone creating a dictionary needs.

Turned down:

- **Listing them with the other options:** they clutter `--help`.
- **Environment variables:** they hide behavior where it's hard to find.

### Remote sources follow their latest

Sources should stay current with no bumping by hand, wherever they live. Before this, syncs relied on devDependencies,
which slow every install, and on pins that go stale: `en-common-misspellings` sat at `typos` `v1.33.1` while `typos`
reached `v1.50.3`.

- **GitHub,** whenever an upstream has a repository. A source is rooted at the folder that holds the dictionary, and
  follows the default branch. `--add-source-ref` points it at another branch, a tag, or a commit.
- **npm,** when there's no usable repository. Files are read from jsDelivr, with no dependency and no tarball. It follows
  the `latest` tag, and `--add-source-version` sets another version or tag.
- **Anything else** is downloaded by hand and defined as a local source, with `--add-source-url` saying where it came
  from. Download pages are mostly behind older dictionaries, and most living upstreams are on GitHub.

Following a branch doesn't let changes in without review: every source has a local copy, and changes arrive in a PR. A
repository that commits broken files shows up in the weekly PR, and then gets pinned.

Turned down:

- **A kind that downloads and unpacks archives:** each site's differs. **A GitLab kind:** could be added later.
- **`dictionary-*` devDependencies,** or always using a published npm package as the release: it doesn't always track
  the words.
- **unpkg instead of jsDelivr:** unpkg has had outages, and supporting both means two APIs. jsDelivr has several CDN
  providers behind it, a documented API for listing a package's files, and many dictionary READMEs already use it.
- **Following the latest release:** of 9 GitHub repositories synced, 5 have no releases, and releases don't always track
  the words. **Pinning a commit, a version, or a range:** needs bumping by hand.

### How the sync handles upstream change

The weekly sync should bring upstream changes in on its own, and report anything a maintainer must act on, once. One
sync command reads `src/sources.yaml`, so a dictionary has one `sync` script.

- **Stored identifiers.** A state file in each source's folder holds what the upstream returned for each file. They're
  opaque: the sync compares what the upstream gave last time with what it gives now, and never calculates them. A file
  is fetched when its identifier changed or it's missing locally.
- **Gone upstream.** Files are renamed and removed as a normal part of a project's life, and the sync can't tell the two
  apart. It keeps the local copy, and marks it gone with the date it was first missed. That shows once in the weekly PR,
  and in the README. If the file comes back, the mark is cleared.
- **Size cap.** A file over 30 MB keeps its old copy and is noted once, the same way. The largest committed source was
  about 21 MB, and GitHub warns at 50 MB. `max-size` on a source raises the cap, such as `40MB`, where 1 MB is 1,048,576
  bytes. A number with no unit is an error, so `40` is never read as bytes.

Turned down:

- **State at the dictionary's root:** keeps stale entries when a folder is deleted or renamed.
- **State in `src/sources.yaml`:** every sync rewrites a file people edit, and the identifiers bury the definitions.
- **Hashing local files instead of storing state:** depends on the upstream never changing how it calculates them.
- **Failing the sync when a file is gone:** the same error every week, holding back every other dictionary.
- **Only a warning in the log:** nobody reads it.
- **Deleting the local copy:** the next build loses words.
- **A growth check on file size,** such as more than double the last size.
- **No size limit,** relying on the PR's diff stats.

### When sources are fetched

Creating a dictionary should succeed with every source or leave nothing behind, and one failing source should never hold
back another dictionary's update.

- **At creation, every remote source is fetched before anything is written.** If one fails, creation stops, and the
  error names the source and the cause. A rerun after fixing it just works.
- **Afterwards, weekly.** The Update Dictionaries workflow syncs a new dictionary every Sunday, so upstream changes arrive together in
  one PR. `pnpm run sync` works by hand at any time.
- **One failure doesn't hold back the rest.** Update Dictionaries opens the PR with whatever synced, then marks the run
  failed, naming the dictionaries that failed. They catch up the next week.

Turned down:

- **Skipping a source that failed at creation,** with a warning that's easy to miss.
- **GitHub's public API without a token:** limited to 60 requests an hour, which fails confusingly on larger repositories.
- **Syncing on every push to `main`:** upstream changes arrive at random, mixed with unrelated work.
- **Stopping every dictionary's update on one failure,** or only warning, so outages go unnoticed.

## Not built yet

Everything above is built, except these parts of the last three sections:

- Sources defined by GitHub repository or npm package at creation, and fetched before anything is written.
- The one sync command that reads `src/sources.yaml`, with npm sources through jsDelivr.
- In the sync of a GitHub source: the check that a file exists locally, gone marks and their note in the README, the
  size cap, and files whose local path differs from their upstream path.
- A weekly update for new dictionaries, and Update Dictionaries carrying on past a dictionary that fails.

<!-- cspell:ignore marcoagpinto wooorm -->
