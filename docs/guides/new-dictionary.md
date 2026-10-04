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

Most new dictionaries don't need ADRs. Record the design as ADRs only when the dictionary takes a different approach
from this guide, or needs scripts of its own beyond `pnpm create-dictionary`, the build, and a `sync` script as in
[Upstream updates](./upstream-updates.md). See [ADRs](../ADRs/README.md).

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

To run it with no questions, add `--yes`. Fields you leave out get their defaults. It stops with an error if:

- the name is missing, `dictionaries/<name>/` already exists, or its package name or dictionary ID is already in use
- a source file is missing (see `--allow-missing-source` below), or two have the same name
- a Hunspell `.dic` file has no `.aff` file next to it, or the other way around
- the description is missing
- the locale and the file type are both `*`
- a value is invalid

For example:

```sh
pnpm create-dictionary --yes <name> <path/to/source/words> --friendly-name "<Friendly Name>" --description "<the words it covers>" --locale <locale> --language-id <file type> --no-build
```

Run `pnpm create-dictionary --help` to list the options.

Each field is described in [Create-dictionary options](#create-dictionary-options).

| Field                                       | Option                                        | Summary                                                    |
| ------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| [name](#name)                               | `<name>` or `--name`                          | The directory name, such as `en_AU` or `ruby`.             |
| [friendly name](#friendly-name)             | `--friendly-name`                             | A readable name, such as `Australian English`.             |
| [description](#description)                 | `--description`                               | Required. The words it covers.                             |
| [npm description](#npm-description)         | `--package-description`                       | The description npm shows.                                 |
| [contributors](#contributors)               | `--contributor`                               | The people who create and maintain this dictionary.        |
| [keywords](#keywords)                       | `--keyword`                                   | Other names people search npm for, such as `golang`.       |
| [source file](#source-file)                 | `<path/to/source/words>` or `--source`        | The word lists and Hunspell `.dic` files to build from.    |
| [third-party sources](#third-party-sources) | `--define-source`, `--add-source-*`           | Sources someone else maintains, each in `src/<name>/`.     |
| [missing source](#missing-source)           | `--allow-missing-source`                      | Start with an empty word list.                             |
| [word files](#word-files)                   | `--no-additional-words`, `--no-exclude-words` | Leave out the files for adding and removing words by hand. |
| [locale](#locale)                           | `--locale`                                    | The languages it's enabled for, such as `en-AU`.           |
| [file type](#file-type)                     | `--language-id`                               | The file types it's enabled for, such as `ruby`.           |
| [store as trie](#store-as-trie)             | `--trie` or `--no-trie`                       | Store it as a trie, for Hunspell files and large lists.    |
| [run build](#run-build)                     | `--build` or `--no-build`                     | Build it now.                                              |
| [no questions](#no-questions)               | `--yes`                                       | Use the defaults for anything not given, and never ask.    |

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
- **`README.md`:** the page people see on npm.

Two things only you can add:

- **Samples:** a few correctly spelled files of the kind this dictionary is for, in `samples/`. They show it works on
  real text. Until `pnpm create-dictionary` sets this up, add `"test:samples": "cspell samples"` to the scripts in
  `package.json`, and run it from `test`.
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
- `pnpm test` passes.
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

Each option answers one question. Without `--yes`, any option you leave out is asked for.

#### Name

`<name>` or `--name`. The directory the dictionary is created in, `dictionaries/<name>/`.

- **What to give:** up to 50 letters, digits, `_`, and `-`.
- **What it changes:** the directory, and from it the package name `@cspell/dict-<id>` and the dictionary ID `<id>`. The
  ID is the name in lowercase, with characters other than letters, digits, and `-` turned into `-`: `en_AU` gives
  `en-au`.
- **Required.**
- **Not allowed:** a name reserved on Windows, such as `con` or `aux`, a name whose directory already exists, whose
  package name or dictionary ID another dictionary already uses, or that's given both ways with different values.

#### Friendly name

`--friendly-name`. A readable name, such as `Australian English`.

- **What it changes:** the `name` in `cspell-ext.json`, the title of the dictionary's README, and a keyword in
  `package.json`. It's the dictionary's title in the repo's README list.
- **If you leave it out:** it uses the name, split at `-` and `_`, with each word capitalized: `medical_terms` gives
  `Medical Terms`. A natural language name like `en_AU` needs one: `--friendly-name "Australian English"`.

#### Description

`--description`. The words the dictionary covers, such as `Ruby keywords and standard library names`.

- **What it changes:** the `description` in `cspell-ext.json` and in its dictionary definition, and the first line of
  the dictionary's README. It's shown in the repo's README list and in cspell's settings.
- **Required.** Only you know what the words are.

#### npm description

`--package-description`. The description npm shows.

- **What it changes:** the `description` in `package.json`, followed by " -- Private until verified" until a maintainer
  makes the dictionary public.
- **If you leave it out:** it uses `<Friendly Name> dictionary for cspell.`, as most dictionaries on npm say. Change it
  only if npm should show something else.

#### Contributors

`--contributor`. Someone who creates or maintains this dictionary in this repository. Repeat it for each person.

- **What to give:** a name, optionally followed by an email in `<…>` and a web address in `(…)`, such as `Jane Doe
(https://example.com/jane-doe)`. A GitHub profile is a good choice for the web address. `package.json` is published,
  so anything given here is public.
- **What it changes:** `contributors` in `package.json`.
- **If you leave it out:** the list stays empty. When it asks, the first answer is filled in with your Git name (`git
config user.name`), and an empty answer skips.
- **Not for:** the authors of an upstream source. They're credited through the source's license and README.

#### Keywords

`--keyword`. Another name people type when they search npm for this dictionary, such as `golang` for Go. Repeat it for
each one.

- **What it changes:** `keywords` in `package.json`, added after the ones every dictionary gets: `cspell`, `cspell-ext`,
  `dictionary`, `spelling`, its name, and its friendly name.
- **If you leave it out:** only the standard keywords are listed. When it asks, give several separated by commas, or
  leave it empty to skip.
- **Not allowed:** an empty keyword, or a comma in one `--keyword`.

#### Source file

`<path/to/source/words>` or `--source`. The files to build the dictionary from.

- **What to give:** word lists, one word per line, usually `.txt` files; and Hunspell `.dic` files. A path is relative
  to where you run the command.
- **More than one:** give several after the name, repeat `--source`, or both. They're combined, and word lists and
  Hunspell files can be mixed: `pnpm create-dictionary en_XX en_XX.dic extra-words.txt`.
- **What it changes:** a copy of each word list in the dictionary's `src/`, and each one as a source in
  `cspell-tools.config.yaml`. A Hunspell file is a [third-party source](#third-party-sources) named after it, copied
  with its pair into `src/<name>/`. Either file of the pair can be given, or both.
- **Not allowed:** a file that doesn't exist (see [Missing source](#missing-source)), a Hunspell file without its pair,
  or two files with the same name, which would both be copied to the same file in `src/`.

#### Third-party sources

`--define-source` and the `--add-source-*` options. Files that someone else maintains, such as a Hunspell dictionary or
a word list from another project. Each is copied into its own folder, `src/<name>/`. `src/sources.yaml` lists each
source with its files, license, README, and URL, so anyone can tell where the words came from and under which terms.

```sh
pnpm create-dictionary en_XX \
  --define-source aoo=./vendor/aoo \
  --add-source-file aoo=dicts/en_XX.dic \
  --add-source-license aoo=LICENSE \
  --add-source-readme aoo=README.md \
  --add-source-url aoo=https://example.com/aoo
```

- **`--define-source [<name>=]<folder>`:** the source's folder. The name defaults to the folder's name.
- **`--add-source-file <name>=<path>`:** a word list or Hunspell file, relative to the folder. Repeat it for each.
- **`--add-source-license <name>=<path>`:** the source's license file, such as `LICENSE` or `COPYING`. This dictionary
  is built from the source, so the license applies to it too. It's copied into `src/<name>/` and published with the
  dictionary.
- **`--add-source-readme <name>=<path>`:** the README that came with the source, such as `README_en_US.txt` from a
  Hunspell dictionary. It often names the authors and states the terms of use, sometimes in place of a license file.
  It's copied and published the same way.
- **`--add-source-url <name>=<url>`:** the web page where the source can be found, so others can check it or get a newer
  version.
- **Paths:** a file keeps its path inside `src/<name>/`. Give another as `<name>/<local path>=<path>`, which a file
  outside the folder, such as `../LICENSE`, needs.
- **Not allowed:** a missing file, a source with no files, or two sources with the same name. A missing license,
  README, or URL is only a warning.

#### Missing source

`--allow-missing-source`. Start with an empty word list when there's no source yet.

- **Without a source:** it creates an empty `src/<name>.txt`.
- **With a source that doesn't exist:** it creates an empty file under that name in `src/`. Each source is checked on
  its own, so the others are still copied.
- **When it asks:** a missing file asks whether to create it empty instead.
- It doesn't apply to Hunspell files, which must exist.

#### Word files

Every new dictionary gets two word lists in `src/`, for fixes by hand after it's built:

- **`src/additional_words.txt`:** words the sources lack. It's built like any other source.
- **`src/exclude_words.txt`:** words to leave out of the built dictionary, such as a wrong form from an upstream source.
  The build lists it under `excludeWordsFrom`.

`--no-additional-words` and `--no-exclude-words` leave them out. A source can't be named like either file.

#### Locale

`--locale`. The languages the dictionary is enabled for.

- **What to give:** a language code with an optional region, such as `en` or `en-AU`. Separate several with commas:
  `en,en-AU`. `*` matches any language.
- **What it changes:** `locale` in `cspell-ext.json`'s `languageSettings`.
- **If you leave it out:** it uses `*`.
- **Use it for:** a natural language dictionary. Leave the file type as `*`.

#### File type

`--language-id`. The file types the dictionary is enabled for.

- **What to give:** a VS Code language ID or file type, such as `java`, `cpp`, or `markdown`. Separate several with
  commas. `*` matches all file types. See [VS Code's language
  identifiers](https://code.visualstudio.com/docs/languages/identifiers).
- **What it changes:** `languageId` in `cspell-ext.json`'s `languageSettings`.
- **If you leave it out:** it uses `*`, unless the locale is `*` too. Then there's no default.
- **Use it for:** any dictionary that isn't a natural language. Leave the locale as `*`.
- **Not allowed:** both the locale and the file type `*`, which would enable the dictionary for every file in every
  language.

#### Store as trie

`--trie` or `--no-trie`. How the built dictionary is stored.

- **`--trie`:** a compact format, much smaller for large lists. Use it for Hunspell files and for source files over
  about 1 MB.
- **`--no-trie`:** plain text, fine for smaller lists such as programming language keywords.
- **If you leave it out:** it stores a Hunspell source as a trie, and anything else as plain text.

#### Run build

`--build` or `--no-build`. Whether to build the dictionary right after creating it.

- **If you leave it out:** it builds a Hunspell source, and doesn't build a word list.
- You can always build later, with `pnpm run build` in the dictionary's directory.
- If the build fails, the dictionary has still been created. Finish it there, or delete the directory and run the
  command again.

#### No questions

`--yes`, or `-y`. Use the defaults for anything not given, and never ask. It stops with an error instead of asking for
something that has no default: the name, the description, the source (unless `--allow-missing-source` is given), and
the locale or the file type.

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
