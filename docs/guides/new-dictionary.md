# Creating a dictionary

<!--
audience: technical contributor
kind: guide
level: comfortable with basic git and a terminal; doesn't read or write code
-->

> [!NOTE]
> For contributors who can fork the repo and follow terminal steps. No coding needed.
> Can't use a terminal? [Open an issue](https://github.com/streetsidesoftware/cspell-dicts/issues/new) with the
> words and where they come from, and someone can build it.

How to build a dictionary for cspell, from the idea to a pull request. You bring the purpose: the words people write
and cspell flags. This guide walks you through the choices and the commands, and maintainers help with the rest in
review. To change the words in an existing dictionary, see [Word changes](./word-changes.md).

## 1. What are you making?

Most dictionaries are one of four kinds. Each kind has its usual answers, and existing dictionaries of that kind show
them. Find yours below, and look at one of its examples before you start.

### A natural language

The words of a language, such as Australian English.

- **Examples:** [German](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/de_DE), and its
  variants for [Austria](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/de_AT) and
  [Switzerland](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/de_CH).
- **Name:** the locale, such as `en_AU`, or the language alone, such as `sv`.
- **Enabled:** for its locale, such as `en-AU`. Decide whether a regional variant is also enabled for the language
  alone: `de_DE` and `de_CH` are enabled for `de`, and `de_AT` isn't.
- **Words:** usually a Hunspell dictionary, a `.dic` and `.aff` pair, often from an npm package such as `dictionary-de`.
  A plain word list works too.
- **Samples:** Wikipedia articles in the language. The command fetches one for you.

See also [Natural language dictionaries](../language-dictionaries.md).

### Terminology of a field

The jargon of an industry or a field, such as medicine or gaming.

- **Examples:** [Medical Terms](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/medicalterms)
  and [Gaming](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/gaming-terms).
- **Name:** the field, such as `gaming-terms`.
- **Enabled:** often not until users enable it (`--no-language-settings`), as Gaming is. Jargon in one project can hide
  a typo in another. Medical Terms is enabled for every file, which a maintainer usually decides.
- **Words:** a list you collect, or a published glossary. Check the glossary's license.
- **Samples:** a text from the field, such as an article.

### A programming language

The keywords and standard library names of a language, such as Python.

- **Examples:** [Python](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/python) and
  [Julia](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/julia).
- **Name:** the language, such as `ruby`.
- **Enabled:** for the language's file type, such as `ruby`. cspell gets a file's type from its extension, so check
  that cspell knows the language's extensions. They are listed in
  [`@cspell/filetypes`](https://github.com/streetsidesoftware/cspell/blob/main/packages/cspell-filetypes/src/definitions.ts).
  If an extension is missing, [Try it with cspell](#7-try-it-with-cspell) shows the fix.
- **Words:** the language's documentation, or the word lists of a tool such as a language server.
- **Samples:** real code files.

### A software ecosystem

The names of a framework, platform, or tool, such as Django or Kubernetes: its packages, APIs, and settings.

- **Examples:** [Django](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/django), enabled for
  Python and HTML, and [K8s](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/k8s),
  enabled for YAML.
- **Name:** the ecosystem, such as `django`.
- **Enabled:** for the file types its code and settings are written in, such as `python,html`. Or not until users enable
  it (`--no-language-settings`), for words that are only right in projects that use it. A framework for one language,
  such as FastAPI, can be enabled for that language's file type, `python`. That accepts its names in every Python
  file, including projects that don't use it.
- **Words:** its documentation, or a list it publishes. These often change, so a maintainer may add a script that
  fetches them again. See [Upstream updates](./upstream-updates.md).
- **Samples:** real files from a project that uses it.

### Something else

Not sure which kind it is, or it doesn't fit? Build it anyway, and say so in the PR. Or
[open an issue](https://github.com/streetsidesoftware/cspell-dicts/issues/new) first, with what the words are and where
they come from. A maintainer will help work out the design.

### Look around

- **Issues and pull requests:** search [cspell-dicts](https://github.com/streetsidesoftware/cspell-dicts/issues?q=) and
  [cspell](https://github.com/streetsidesoftware/cspell/issues?q=). Someone may have asked for this dictionary, started
  it, or added its file types to cspell.
- **Related dictionaries:** see which dictionaries already have some of its words. They are good examples to follow.
  Sharing words is normal: the German dictionaries share most of theirs.

  ```sh
  pnpm install
  pnpm run prepare:dictionaries
  pnpm exec cspell trace --only-found <word>
  ```

  `cspell trace` needs the prepared dictionaries. If it prints "Dictionary Errors.", some failed to load, and their
  words are missing from the result.

## 2. Decide the design

A dictionary's name, and when it's enabled, end up in users' settings from its first release. They are hard to change
later, so settle them first. Start from the usual answers for your kind.

- **Directory name:** a short name, such as `ruby` or `en_AU`. The package name is derived from it:
  `@cspell/dict-<name>`, lowercase, with other characters replaced by `-` (`en_AU` becomes `@cspell/dict-en-au`).
- **Dictionary IDs:** usually the same name. A dictionary package can define more than one.
- **When it's enabled:** which files cspell uses the dictionary for, set in `cspell-ext.json`. The command writes this
  for you. Pick one:
  - **For some locales or file types:** set `locale` and `languageId` in `languageSettings`. A natural language
    dictionary sets the locale, such as `en-AU`, and leaves the file type as `*`. Any other dictionary sets the file
    type, such as `ruby`, and leaves the locale as `*`.
  - **Disabled until users enable it:** for words that are only right in some projects. Users add the dictionary ID to
    `dictionaries` themselves. See [No language settings](#no-language-settings).
  - **Always enabled:** list the dictionary ID in the top-level `dictionaries`, as `@cspell/dict-software-terms` does.
    A maintainer usually decides this. See [Enabled for every file](#enabled-for-every-file).

  Never use a `languageSettings` entry with both `locale` and `languageId` set to `*`. Use the top-level
  `dictionaries` instead, so users find every always-enabled dictionary in the same place when they disable one or
  limit it.

## 3. Check the sources and their license

- Where do the words come from? Your own list, a project's documentation, or an upstream word list?
- What is the source's license? The dictionary package's `license` field and `LICENSE` must allow it, and upstream license
  files are published with it (added to `files`). `pnpm create-dictionary` writes an MIT `LICENSE`: change it if the source
  requires.
- If the license is missing or unclear, stop and ask the maintainers in an issue before going further.

For an upstream word list, also read [Upstream updates](./upstream-updates.md): the dictionary gets a `sync` script.

Tips for the words:

- **Errors:** a source can have typos. Leave the wrong words out with `src/exclude_words.txt`.
- **Gaps:** a dictionary is only as complete as its source. Compare the source with a few real files, and add what's
  missing to `src/additional_words.txt`.

## 4. Create the dictionary

Check the [prerequisites](../repository.md#prerequisites). Then, from the repo root:

```sh
pnpm install
pnpm run prepare:dictionaries
pnpm create-dictionary
```

It asks for each field below. Any field given as an option on the command line is not asked:

```sh
pnpm create-dictionary <name> <path/to/source/words> --language-id <file type>
```

Each dictionary needs:

- A unique [name](#name)
- A [description](#description)
- The natural language it targets ([locale](#locale)), or the programming language ([file type](#file-type)), when one
  of them should enable it
- At least one [source file](#source-file) or [placeholder](#placeholder-word-lists)

To run it with no questions, add `--yes` and give these as options. Everything else gets a default.

For example:

```sh
pnpm create-dictionary --yes <name> <path/to/source/words> --friendly-name "<Friendly Name>" --description "<the words it covers>" --locale <locale> --language-id <file type> --no-build
```

Run `pnpm create-dictionary --help` to list the options.

Each field is described in [Create-dictionary options](#create-dictionary-options).

| Group               | Field                                             | Option                                                        | Summary                                                                   |
| ------------------- | ------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Dictionary info     | [name](#name)                                     | `<name>` or `--name`                                          | The directory name, such as `en_AU` or `ruby`.                            |
|                     | [friendly name](#friendly-name)                   | `--friendly-name`                                             | A readable name, such as `Australian English`.                            |
|                     | [description](#description)                       | `--description`                                               | The words it covers. Required, unless the name is a language.             |
|                     | [npm description](#npm-description)               | `--package-description`                                       | The description npm shows.                                                |
|                     | [keywords](#keywords)                             | `--keyword`                                                   | Other keywords people search npm for, such as `golang`.                   |
| When it's used      | [locale](#locale)                                 | `--locale`                                                    | The languages it's enabled for, such as `en-AU`.                          |
|                     | [file type](#file-type)                           | `--language-id`                                               | The file types it's enabled for, such as `ruby`.                          |
|                     | [every file](#enabled-for-every-file)             | `--enable-for-all-files`                                      | Enable it for every file.                                                 |
|                     | [no language settings](#no-language-settings)     | `--no-language-settings`                                      | Leave out `languageSettings`, so the locale and file type enable nothing. |
| Words               | [source file](#source-file)                       | `<path/to/source/words>` or `--source`                        | The word lists and Hunspell `.dic` files to build from.                   |
|                     | [third-party sources](#third-party-sources)       | `--define-source`, `--add-source-*`                           | Sources someone else maintains, each in `src/<name>/`.                    |
|                     | [placeholder word lists](#placeholder-word-lists) | `--placeholder-word-lists`                                    | Start a missing word list empty.                                          |
|                     | [word files](#word-files)                         | `--no-additional-words`, `--no-exclude-words`                 | Leave out the files for adding and removing words by hand.                |
| Samples             | [samples](#samples)                               | `--add-sample`, `--add-sample-origin`, `--add-sample-license` | Real files its tests spell check, where each came from, and its license.  |
| Build settings      | [store as trie](#store-as-trie)                   | `--trie` or `--no-trie`                                       | Store it as a trie, for Hunspell files and large lists.                   |
|                     | [Hunspell depth](#hunspell-depth)                 | `--hunspell-depth`                                            | How many affix rules to apply to each Hunspell word.                      |
| Maintainers         | [contributors](#contributors)                     | `--contributor`                                               | The people who create and maintain this dictionary.                       |
| Running the command | [run build](#run-build)                           | `--build` or `--no-build`                                     | Build it now.                                                             |
|                     | [no questions](#no-questions)                     | `--yes`                                                       | Use the defaults for anything not given, and never ask.                   |

It creates `dictionaries/<name>/` with `version` `0.0.1-alpha.0` and `private: true`, so the dictionary isn't published. A
maintainer makes it public once the dictionary has been verified.

## 5. The resulting dictionary

`pnpm create-dictionary` created a working dictionary in `dictionaries/<name>/`:

- **`src/`:** what it's built from: your word lists, `additional_words.txt` and `exclude_words.txt` for fixes by hand,
  and a folder for each third-party source. `sources.yaml` lists each source's files, its license and README, and its
  URL, so anyone can tell where the words came from.
- **`dict/`:** the built dictionary, made from `src/` by `pnpm run build`.
- **`cspell-ext.json`:** what cspell loads: the dictionary's name, its description, and the languages or file types it's
  enabled for.
- **`package.json`:** what npm publishes. It stays private until a maintainer publishes it.
- **`samples/`:** what `pnpm test` spell checks: the samples you gave, and `sample-words-in-dictionary.txt`, a few
  dozen words from across the sources. `README.md` there says where each sample came from.
- **`README.md`:** the page people see on npm.

Two things only you can add:

- **Samples:** a few correctly spelled files of the kind this dictionary is for. They show it works on real text. To add
  more, run this in the dictionary's folder:

  ```sh
  pnpm exec add-samples
  ```

  It asks for files and Wikipedia articles, copies them into `samples/`, and lists each one's source and license in
  `samples/README.md`. It takes the same `--add-sample`, `--add-sample-origin`, `--add-sample-license`, and
  `--add-wikipedia-sample` options as `pnpm create-dictionary`.

- **The README's description:** a few sentences on what this dictionary covers and why to use it.

## 6. Build and test

In the dictionary's directory:

```sh
pnpm run build
pnpm test
```

Then, from the repo root, fix formatting:

```sh
pnpm run lint
```

Checks:

- `dict/` holds the built files, and they look right.
- `pnpm test` passes. Real samples often have words the dictionary lacks. For each word it reports:
  - A real word: add it to `src/additional_words.txt`, and build again.
  - A name, such as a person or a river: add it to `words` in `samples/cspell.json`.
  - A name from the code, such as a variable, a project, or a test string: add it to `words` in `samples/cspell.json`
    too. Code samples bring many of these, so prefer samples with few test strings.
- `pnpm run lint` leaves no errors. It spell checks the dictionary's README and settings too. Add a word they need, such
  as a source's name, to `words` in the dictionary's `cspell.json`.

## 7. Try it with cspell

From the dictionary's directory, create a config file that imports the dictionary and enables it:

```sh
pnpm exec cspell init --output try.config.yaml --import ./cspell-ext.json --dictionary <dictionary ID>
```

Check some files with it:

```sh
pnpm exec cspell lint --config try.config.yaml --root <folder> --locale=<locale> --language-id=<file type> <file>
```

Words the dictionary has aren't reported. `<file>` is relative to `<folder>`.

Delete `try.config.yaml` when you are done, so it isn't committed.

### For code: check it's enabled by file type

The check above enables the dictionary by name. Users get it by file type instead, which cspell gets from a file's
extension. For a dictionary enabled for a file type, check a file with each of its extensions, without `--language-id`.
From the repo root:

```sh
pnpm exec cspell lint --no-progress -c dictionaries/<name>/cspell-ext.json --root <folder> <file>
```

If it reports words the dictionary has, cspell doesn't map that extension to the file type. Add an `overrides` entry
to `cspell-ext.json`, so users get the fix too.
[Julia](https://github.com/streetsidesoftware/cspell-dicts/blob/main/dictionaries/julia/cspell-ext.json) has one from
before cspell knew `.jl`:

```json
"overrides": [{ "filename": "**/*.jl", "languageId": "julia" }]
```

- File names are case sensitive here, so list uppercase extensions too.
- An override's `languageId` replaces the file type cspell gave the file. When cspell gives a file two file types, such
  as `json` and `jsonc` for a `.jsonc` file, list both, so users' settings for either still apply.
- On macOS and Windows, `a.PY` and `a.py` are the same file. Check each in its own folder.
- Don't fix this in `samples/cspell.json`. That only hides the problem from the tests. Its own override sets the file
  type for `sample-words-in-dictionary.txt` only. Other samples get theirs from their extension, as users' files do.

## 8. Open a PR

- Leave `private: true` and "-- Private until verified" in `package.json`. A maintainer will review the dictionary and
  take care of the publication process. That often takes more PRs, for samples or build changes.
- Use a `feat(<name>): add <friendly name> dictionary` title. See
  [Commits and pull requests](../commits-and-pull-requests.md).
- Unsure about a choice? Say so in the PR description. Maintainers help in review.

## Reference

### Create-dictionary options

Most options answer one of the questions `pnpm create-dictionary` asks. A question is skipped when its option is given.
With `--yes`, nothing is asked.

#### Dictionary info

##### Name

The directory to create the dictionary in. Required.

```sh
pnpm create-dictionary en_AU
pnpm create-dictionary --name en_AU
```

The dictionary goes in `dictionaries/<name>/`. Its dictionary ID is the name in lowercase, with `_` turned into `-`. Its
package name is `@cspell/dict-` followed by the ID. So `en_AU` gives the ID `en-au`. The command shows both right after
the name.

The name is written the repo's way: words joined with `-`, and all lowercase except a locale's region or script. So
`Medical Terms` gives `medical-terms`, `en-au` gives `en_AU`, and `German` gives `german`. The command says when it
changes a name. A name typed with spaces, such as `Medical Terms`, is also the default friendly name.

A name has up to 50 letters, digits, `_`, and `-`. These names aren't allowed:

- a name whose directory already exists
- a name whose package name or dictionary ID another dictionary uses
- a name reserved on Windows, such as `con` or `aux`
- a name given both ways, with different values

##### Friendly name

A readable name, used as the dictionary's title.

```sh
pnpm create-dictionary medical-terms --friendly-name "Medical Terminology"
```

It's the title of the dictionary's README, and of its entry in the list of dictionaries in the repo's README. It's also
the dictionary's name in cspell's settings, and a keyword on npm.

Without it, a name that is a locale gives that locale's name: `en_AU` gives "Australian English". Any other name is
split at `-` and `_`, and each word is capitalized: `medical-terms` gives "Medical Terms".

##### Description

The words the dictionary covers. Required, unless the name is a language.

```sh
pnpm create-dictionary ruby --description "Ruby keywords and standard library names"
```

It's the first line of the dictionary's README. cspell shows it in its settings, and the list of dictionaries in the
repo's README shows it too.

A name that is a language or locale gives a default: `en_AU` gives "Australian English dictionary".

##### npm description

The description npm shows.

```sh
pnpm create-dictionary en_AU --package-description "Australian English words for cspell."
```

It's the `description` in `package.json`. Without it, the description is built from the friendly name, as on most
dictionaries: "Australian English" gives "Australian English dictionary for cspell." Until a maintainer publishes the
dictionary, " -- Private until verified" follows it.

##### Keywords

Other keywords people search npm for. Repeat the option for each one.

```sh
pnpm create-dictionary go --keyword golang
```

Every dictionary already has the keywords cspell, cspell-ext, dictionary, and spelling. Its name and friendly name are
keywords too. These options add to that list.

When the command asks, separate several keywords with commas. One `--keyword` can't be empty or hold a comma.

#### When it's used

A natural language dictionary sets the locale, and a programming or file-type dictionary sets the file type. A
specialized one may set neither. When neither is given, the command first asks whether it's for a natural language or
for file types, then asks only that one. A name that is a language skips that
question.

##### Locale

The languages the dictionary is enabled for. Use it for a natural language.

```sh
pnpm create-dictionary en_AU --locale en-AU
```

Give a language code, with an optional region, such as `en` or `en-AU`. Separate several with commas. Without it, a
name that stands for a locale gives it: `en_AU` gives `en-AU`, and `german` gives `de`. Any other name gives `*`, which
matches any language, and so does giving a file type: `en_IN --language-id erlang` gets no locale. That includes a name that only starts with a locale, such as `en_GB-legacy` or `it-terms`, since
the start may not mean a language.

When the command asks, a name that stands for a locale brings up a checklist of that language's locales, with the one from the name ticked:
`german` offers `de`, `de-AT`, `de-CH`, and `de-DE`. Tick any others, or pick "Something else" to type them.

Don't know the code? Type the language's name instead, such as "English", in English or in your computer's language.
When the command asks, it lists the locales that name could mean, such as `en` (English) and `en-AU` (Australian
English), and you pick one or more. Given as an option, an unknown locale is kept, with a warning that lists them.

##### File type

The file types the dictionary is enabled for. Use it for a programming language or a kind of file.

```sh
pnpm create-dictionary ruby --language-id ruby
```

Give a [VS Code language ID](https://code.visualstudio.com/docs/languages/identifiers), such as `java` or `markdown`.
Separate several with commas. Without it, the file type is `*`, which matches any file.

A typed `*` that leaves both the locale and the file type as `*` is an error, unless `languageSettings` is left out. To
enable a dictionary for every file, use [`--enable-for-all-files`](#enabled-for-every-file).

##### Enabled for every file

Enable the dictionary for every file, in every language.

```sh
pnpm create-dictionary companies companies.txt --enable-for-all-files
```

It adds the dictionary ID to the top-level `dictionaries`, and includes `--no-language-settings`. Its words are then accepted
everywhere, including where they should be flagged, so a maintainer may ask you to change this in review.

The locale and the file type can still be given, as in [No language settings](#no-language-settings).

##### No language settings

Leave out the `languageSettings` section, so the dictionary isn't enabled until users add it to their settings.

```sh
pnpm create-dictionary google google.txt --no-language-settings
pnpm create-dictionary en_XX-slang slang.txt --no-language-settings --locale en
```

The locale and the file type, including a locale from the name, still say what the samples are: the language they're
checked in and fetched from Wikipedia in, and the file type they're checked as. They don't enable the dictionary.

This only holds while creating it. Later, `pnpm exec add-samples` doesn't know the language, so it fetches no Wikipedia
article for a dictionary without `languageSettings`.

With `--yes`, this is also what happens when the options and the name give no locale or file type. Either way, the
command says the dictionary isn't enabled yet.

#### Words

##### Source file

The word lists and Hunspell files to build from.

```sh
pnpm create-dictionary en_XX en_XX.dic extra-words.txt
pnpm create-dictionary en_XX --source en_XX.dic --source extra-words.txt
```

Give as many as you need, in either form or both. Paths are relative to where you run the command.

A word list has one word per line, usually in a `.txt` file. Each one is copied into `src/` and built as a source.

A Hunspell dictionary is a pair of files, `.dic` and `.aff`. Give either one, or both. The pair is copied into
`src/hunspell/`, out of the way of the word lists people edit. Every Hunspell file given this way goes there, as one
[third-party source](#third-party-sources) named `hunspell`. So its license goes in with
`--add-source-license hunspell=<path>`, where the path is relative to where you run the command. When the command
asks, it asks for the license, README, and web page after the Hunspell file.

These aren't allowed:

- a file that doesn't exist (see [Placeholder word lists](#placeholder-word-lists))
- a Hunspell file without its pair
- two files with the same name, such as two `index.dic`, since both would be copied to the same place

##### Third-party sources

Files someone else maintains, such as a Hunspell dictionary from another project.

```sh
pnpm create-dictionary en_XX \
  --define-source aoo=./vendor/openoffice-en \
  --add-source-file aoo=dicts/en_XX.dic \
  --add-source-license aoo=LICENSE \
  --add-source-readme aoo=README.md \
  --add-source-url aoo=https://example.com/aoo
```

Each source is copied into its own folder in `src/`, named after the source. The file `src/sources.yaml` lists each
source's files, license, README, and web page. From it, anyone can tell where the words came from, and on what terms.

Describe a source with these options:

- **Folder:** give it with `--define-source`. This comes first, and names the source. The name is the folder's name,
  unless you write `<name>=<folder>`.
- **Word files:** add each word list or Hunspell file with `--add-source-file`. Its path is relative to the folder. A
  Hunspell file brings its pair along.
- **License:** add it with `--add-source-license`. The license applies to this dictionary too, because it's built from
  the source. The license file is published with the dictionary.
- **README:** add it with `--add-source-readme`. A source's README often names its authors and its terms of use,
  sometimes in place of a license file. It's published with the dictionary too.
- **Web page:** add it with `--add-source-url`. Others can check the source there, or find a newer version.

Each of these options starts with the source's name, as in `aoo=LICENSE`.

Each file is copied to the same path inside the source's folder in `src/`. To copy it somewhere else, write the new
path after the source's name, as in `aoo/LICENSE=../LICENSE`. A file from outside the source's folder must be given
this way:

```sh
--add-source-license aoo/LICENSE=../LICENSE
```

A source needs at least one word file, and each file must exist. Two sources can't have the same name. A missing
license, README, or web page only gets a warning.

##### Placeholder word lists

Start a word list empty, as a placeholder, when its words don't exist yet.

```sh
pnpm create-dictionary medical-terms --placeholder-word-lists
pnpm create-dictionary medical-terms terms.txt --placeholder-word-lists
```

With no source given, it creates an empty `src/medical-terms.txt`. A word list you give that doesn't exist is created
empty, under its name. The other sources are copied as usual.

It only applies to word lists given on their own. A missing Hunspell file or third-party file is always an error, since
someone else made those files.

Without this option, the command asks whether to create a missing word list as a placeholder. With `--yes`, a missing
word list is an error.

##### Word files

Every new dictionary gets two empty word lists in `src/`, for fixes by hand:

- **additional_words.txt:** words the sources lack. It's built like any other source.
- **exclude_words.txt:** words to leave out of the built dictionary, such as a wrong form from a third-party source.

To leave them out:

```sh
pnpm create-dictionary ruby ruby-words.txt --no-additional-words --no-exclude-words
```

A word list you give can't be named `README.md`, or like a word file that's created.

#### Samples

Real files of the kind the dictionary is for, which its tests spell check. Repeat the options for each sample.

```sh
pnpm create-dictionary ruby ruby-words.txt \
  --add-sample examples/hello.rb \
  --add-sample-origin "hello.rb=https://example.com/ruby/hello" \
  --add-sample-license "hello.rb=MIT"
```

Each sample is copied into `samples/` under its own name. `samples/sample-sources.csv` lists it with:

- **Source:** where it came from, a web address or a few words, given as `<file name>=<origin>`. Link a GitHub file at
  its commit. The table names the link by its repository and path, such as `github.com/vim/vim: runtime/defaults.vim`,
  so it stays short.
- **Added:** the day it was added.
- **License:** the license it came under, such as MIT, given as `<file name>=<license>`.

A source or license not given is `unknown`, and a sample without a source gets a warning. `samples/README.md` shows the
list as a table. Don't edit the table: edit `sample-sources.csv`, and run `pnpm run build:readme` from the repo root.

Samples show the dictionary works on real text, as it's really written. Pick a neutral subject, not a political or
ideological one, as the [Code of Conduct](https://github.com/streetsidesoftware/cspell-dicts/blob/main/CODE_OF_CONDUCT.md)
asks. An article about a city is fine, unless the city itself is contested.

For a natural language, Wikipedia articles make good samples. The command fetches the start of an article in the
dictionary's language, and saves it in `samples/`, with its link as the source and Wikipedia's license, CC BY-SA 4.0:

```sh
pnpm create-dictionary german --add-wikipedia-sample Berlin
pnpm create-dictionary german --add-wikipedia-sample https://de.wikipedia.org/wiki/Brandenburger_Tor
```

Give a title, in the dictionary's language or in English, or the article's link. `Berlin` is saved as `berlin.md`.
When the command asks, it asks for more articles until the answer is empty.

It always fetches the article on Seattle, as `seattle.md`, unless you give `--no-wikipedia-sample`. Without a network
connection, articles are simply left out.

Without any samples, the command warns. The tests still check `samples/sample-words-in-dictionary.txt`, a few dozen
words from across the sources. It's written once, when the dictionary is created, and you can edit it like any sample.

#### Build settings

##### Store as trie

How the built dictionary is stored.

```sh
pnpm create-dictionary en_XX en_XX.dic --trie
pnpm create-dictionary ruby ruby-words.txt --no-trie
```

A trie is a compact format, much smaller for large word lists. Plain text suits smaller lists, such as a language's
keywords.

The command chooses for you and doesn't ask: a trie if a source is a Hunspell file, or if the word lists total more than
1 MB, and plain text otherwise. Use these options only to override that choice.

##### Hunspell depth

How many affix rules the build applies to each Hunspell word.

```sh
pnpm create-dictionary he he.dic --hunspell-depth 0
```

A Hunspell dictionary stores stems, such as "walk", and rules that add prefixes and suffixes, such as "-ing" and "-ed".
Each level of depth applies one more rule to a word. A higher depth adds more word forms, but can make the build very
slow, or run out of memory.

Without it, the depth is 1. Use 0 to keep only the stems, as Hebrew does, when even 1 is too slow. Raise it only when
common word forms are missing. It's the `maxDepth` in the dictionary's `cspell-tools.config.yaml`, so you can change it
there later.

#### Maintainers

##### Contributors

The people who create and maintain this dictionary in this repo. Repeat the option for each person.

```sh
pnpm create-dictionary medical-terms \
  --contributor "Jane Doe (https://example.com/jane-doe)" \
  --contributor "John Doe <john@example.com>"
```

Give a name, optionally followed by an email in `<…>`, a web address in `(…)`, or both. A GitHub profile makes a good web
address. Each person is listed in `package.json`. That file is published, so everything given here is public.

When the command asks, it suggests your Git name. Leave an answer empty to stop adding people.

Don't list the authors of a [third-party source](#third-party-sources). The source's license and README credit them.

#### Running the command

##### Run build

Whether to build the dictionary right after creating it.

```sh
pnpm create-dictionary en_XX en_XX.dic --build
pnpm create-dictionary ruby ruby-words.txt --no-build
```

Without either option, it builds a dictionary made only of word lists, which takes seconds. It doesn't build one with a
Hunspell source, which can take minutes or run out of memory. The new dictionary's tests fail until it's built.

To build later, run `pnpm run build` in the dictionary's directory. If the build fails, the dictionary is still created.
Fix the problem and build again, or delete the directory and run `pnpm create-dictionary` again.

##### No questions

Never ask, and use the defaults for anything not given. The short form is `-y`.

```sh
pnpm create-dictionary --yes ruby ruby-words.txt --description "Ruby keywords" --language-id ruby
```

Some answers have no default: the name, the description (unless the name is a language), and a source. Leaving any of
these out is an error. To start without a source, add `--placeholder-word-lists`.

Without a locale or a file type, the dictionary is created with [no language settings](#no-language-settings), and isn't
enabled.

## Dictionary definitions

Each entry in `dictionaryDefinitions` in `cspell-ext.json`:

| Field                   | Description                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `name`                  | The dictionary ID. For a natural language, it's good practice to match the locale, such as `en_us`. |
| `path`                  | The relative path from `cspell-ext.json` to the built file.                                         |
| `description`           | An easy-to-read description, such as `British English Dictionary`.                                  |
| `dictionaryInformation` | For natural languages, see [Dictionary information](#dictionary-information).                       |

### Dictionary information

It improves suggestions. See the Dutch example in
[`dictionaries/nl_NL/cspell-ext.json`](../../dictionaries/nl_NL/cspell-ext.json), and
[Natural language dictionaries](../language-dictionaries.md) for edit costs.

| Field      | Example         | Description                   |
| ---------- | --------------- | ----------------------------- |
| `alphabet` | `a-zA-Zé`       | The letters of the alphabet.  |
| `locale`   | `nl-NL`         | The locale of the dictionary. |
| `accents`  | `\u0300-\u0308` | Accent characters.            |

### Using YAML

YAML can be easier to write than JSON. Have `cspell-ext.json` import a YAML file:

**`cspell-ext.json`**

```json
{
  "import": ["./cspell.config.yaml"]
}
```

### Viewing suggestions

```sh
pnpm exec cspell suggestions -v <word>
```

Use `--locale` or `--dictionary` to limit the suggestions.
