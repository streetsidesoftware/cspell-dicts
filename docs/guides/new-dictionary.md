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

How to add a new dictionary package. To change the words in an existing one, see [Word changes](./word-changes.md).

A new package makes public promises from its first release: its package name, its dictionary IDs, and the files or
locales it's enabled for all end up in users' configs. Settle those before building.

## Kinds of dictionaries

- **Programming and file-type dictionaries** hold the keywords, common libraries, function names, and other words of an
  ecosystem. Examples: [TypeScript](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/typescript)
  and [Python](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/python).
- **Natural language dictionaries** hold the words of a language, often built from a Hunspell dictionary. Example:
  [English US](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries/en_US). See also
  [Natural language dictionaries](../language-dictionaries.md).
- **Specialized dictionaries** hold the words of a field, such as `companies` or `medicalterms`.

## 1. Check it doesn't exist

- Look through `dictionaries/` and the root `README.md`'s list of dictionaries.
- Run `pnpm exec cspell trace --only-found <word>` from the repo root with a few typical words, to see which
  dictionaries already have them.

If an existing dictionary comes close, adding words to it may be the better change.

## 2. Decide the design

- **Directory name:** a short name, such as `ruby` or `en_AU`. The package name is derived from it:
  `@cspell/dict-<name>`, lowercase, with other characters replaced by `-` (`en_AU` becomes `@cspell/dict-en-au`).
- **Dictionary IDs:** usually the same name. A dictionary package can define more than one.
- **Locale and file type:** which files cspell uses the dictionary for, set by `locale` and `languageId` in
  `languageSettings`. Or leave it off, so users add it to `dictionaries` themselves.
  - A natural language dictionary sets the locale, such as `en-AU`, and leaves the file type as `*`.
  - Any other dictionary sets the file type, such as `ruby`, and leaves the locale as `*`.
  - Not both `*`: that enables the dictionary for every file in every language.
- **Format:** plaintext, or a trie for large lists such as Hunspell dictionaries.

If this dictionary doesn't fit these steps, [open an issue](https://github.com/streetsidesoftware/cspell-dicts/issues/new)
before building it. Say what the words are and where they come from. A maintainer will help work out the design.

## 3. Check the sources and their license

- Where do the words come from? Your own list, a project's documentation, or an upstream word list?
- What is the source's license? The dictionary package's `license` field and `LICENSE` must allow it, and upstream license
  files are published with it (added to `files`). `pnpm create-dictionary` writes an MIT `LICENSE`: change it if the source
  requires.
- If the license is missing or unclear, stop and ask the maintainers in an issue before going further.

For an upstream word list, also read [Upstream updates](./upstream-updates.md): the dictionary gets a `sync` script.

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
- The natural language it targets ([locale](#locale)), or the programming language ([file type](#file-type))
- At least one [source file](#source-file) or [placeholder](#placeholder-word-lists)

To run it with no questions, add `--yes` and give these as options. Everything else gets a default.

For example:

```sh
pnpm create-dictionary --yes <name> <path/to/source/words> --friendly-name "<Friendly Name>" --description "<the words it covers>" --locale <locale> --language-id <file type> --no-build
```

Run `pnpm create-dictionary --help` to list the options.

Each field is described in [Create-dictionary options](#create-dictionary-options).

| Group               | Field                                             | Option                                                        | Summary                                                                  |
| ------------------- | ------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Dictionary info     | [name](#name)                                     | `<name>` or `--name`                                          | The directory name, such as `en_AU` or `ruby`.                           |
|                     | [friendly name](#friendly-name)                   | `--friendly-name`                                             | A readable name, such as `Australian English`.                           |
|                     | [description](#description)                       | `--description`                                               | The words it covers. Required, unless the name is a language.            |
|                     | [npm description](#npm-description)               | `--package-description`                                       | The description npm shows.                                               |
|                     | [keywords](#keywords)                             | `--keyword`                                                   | Other keywords people search npm for, such as `golang`.                  |
| When it's used      | [locale](#locale)                                 | `--locale`                                                    | The languages it's enabled for, such as `en-AU`.                         |
|                     | [file type](#file-type)                           | `--language-id`                                               | The file types it's enabled for, such as `ruby`.                         |
| Words               | [source file](#source-file)                       | `<path/to/source/words>` or `--source`                        | The word lists and Hunspell `.dic` files to build from.                  |
|                     | [third-party sources](#third-party-sources)       | `--define-source`, `--add-source-*`                           | Sources someone else maintains, each in `src/<name>/`.                   |
|                     | [placeholder word lists](#placeholder-word-lists) | `--placeholder-word-lists`                                    | Start a missing word list empty.                                         |
|                     | [word files](#word-files)                         | `--no-additional-words`, `--no-exclude-words`                 | Leave out the files for adding and removing words by hand.               |
| Samples             | [samples](#samples)                               | `--add-sample`, `--add-sample-origin`, `--add-sample-license` | Real files its tests spell check, where each came from, and its license. |
| Build settings      | [store as trie](#store-as-trie)                   | `--trie` or `--no-trie`                                       | Store it as a trie, for Hunspell files and large lists.                  |
|                     | [Hunspell depth](#hunspell-depth)                 | `--hunspell-depth`                                            | How many affix rules to apply to each Hunspell word.                     |
| Maintainers         | [contributors](#contributors)                     | `--contributor`                                               | The people who create and maintain this dictionary.                      |
| Running the command | [run build](#run-build)                           | `--build` or `--no-build`                                     | Build it now.                                                            |
|                     | [no questions](#no-questions)                     | `--yes`                                                       | Use the defaults for anything not given, and never ask.                  |

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
- `pnpm run lint` leaves no errors.

## 7. Try it with cspell

From the dictionary's directory, link the dictionary into your global cspell config:

```sh
pnpm exec cspell link add ./cspell-ext.json
```

Check some files with it:

```sh
pnpm exec cspell check <path/to/file> --locale=<locale> --language-id=<file type>
```

`check` shows the whole file, with ignored text in gray and issues in red. Use VS Code instead if you prefer: the link
applies there too.

Unlink when you are done:

```sh
pnpm exec cspell link remove ./cspell-ext.json
```

## 8. Open a PR

- Leave `private: true` and "-- Private until verified" in `package.json`. A maintainer will review the dictionary and
  take care of the publication process. That often takes more PRs, for samples or build changes.
- Use a `feat(<name>): add <friendly name> dictionary` title. See
  [Commits and pull requests](../commits-and-pull-requests.md).

## Reference

### Create-dictionary options

Each option answers one of the questions `pnpm create-dictionary` asks. A question is skipped when its option is given.
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

A natural language dictionary sets the locale, and any other dictionary sets the file type. When neither is given, the
command first asks which kind this dictionary is, then asks only that one. A name that is a language skips that
question.

##### Locale

The languages the dictionary is enabled for. Use it for a natural language.

```sh
pnpm create-dictionary en_AU --locale en-AU
```

Give a language code, with an optional region, such as `en` or `en-AU`. Separate several with commas. Without it, a
name that stands for a locale gives it: `en_AU` gives `en-AU`, and `german` gives `de`. Any other name gives `*`, which
matches any language.

When the command asks, such a name brings up a checklist of that language's locales, with the one from the name ticked:
`german` offers `de`, `de-AT`, `de-CH`, and `de-DE`. Tick any others, or pick "Something else" to type them.

Don't know the code? Type the language's name instead, such as "English", in English or in your computer's language.
When the command asks, it lists the locales that name could mean, such as `en` (English) and `en-AU` (Australian
English), and you pick one or more. Given as an option, an unknown locale is kept, with a warning that lists them.

##### File type

The file types the dictionary is enabled for. Use it for anything that isn't a natural language.

```sh
pnpm create-dictionary ruby --language-id ruby
```

Give a [VS Code language ID](https://code.visualstudio.com/docs/languages/identifiers), such as `java` or `markdown`.
Separate several with commas. Without it, the file type is `*`, which matches any file.

The locale and the file type can't both be `*`. That would enable the dictionary for every file in every language.

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

- **Source:** where it came from, a web address or a few words, given as `<file name>=<origin>`.
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

Some answers have no default: the name, the description (unless the name is a language), and a source. The locale and the file type can't both be
left out. Leaving any of these out is an error. To start without a source, add `--placeholder-word-lists`.

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
