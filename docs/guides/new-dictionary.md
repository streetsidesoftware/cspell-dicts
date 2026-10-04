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
locales it is turned on for all end up in users' configs. Settle those before building.

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
  - Not both `*`: that turns the dictionary on for every file in every language.
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

| Field                               | Option                                 | Summary                                                     |
| ----------------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| [name](#name)                       | `<name>` or `--name`                   | The directory name, such as `en_AU` or `ruby`.              |
| [friendly name](#friendly-name)     | `--friendly-name`                      | A readable name, such as `Australian English`.              |
| [description](#description)         | `--description`                        | Required. The words it covers.                              |
| [npm description](#npm-description) | `--package-description`                | The description npm shows.                                  |
| [source file](#source-file)         | `<path/to/source/words>` or `--source` | The word lists and Hunspell `.dic` files to build from.     |
| [missing source](#missing-source)   | `--allow-missing-source`               | Start with an empty word list.                              |
| [locale](#locale)                   | `--locale`                             | The languages that turn the dictionary on, such as `en-AU`. |
| [file type](#file-type)             | `--language-id`                        | The file types that turn the dictionary on, such as `ruby`. |
| [store as trie](#store-as-trie)     | `--trie` or `--no-trie`                | Store it as a trie, for Hunspell files and large lists.     |
| [run build](#run-build)             | `--build` or `--no-build`              | Build it now.                                               |
| [no questions](#no-questions)       | `--yes`                                | Use the defaults for anything not given, and never ask.     |

It creates `dictionaries/<name>/` with `version` `0.0.1-alpha.0` and `private: true`, so the dictionary isn't published. A
maintainer makes it public once the dictionary has been verified.

## 5. Check the resulting dictionary

`pnpm create-dictionary` wrote a complete dictionary in `dictionaries/<name>/` from your answers. Go through its files
once: most only need a check, and a few need something only you can add.

- **`src/`: the word lists.** The build reads every word of this dictionary from here. The tool copied in the source
  files you gave it, or started an empty one.
  - Check that each word list has one word or phrase per line, formatted as in [Word lists](../word-lists.md#format).
  - Check: no headers, notes, or other text that isn't a word, except `#` comments.
- **`cspell-tools.config.yaml`: how the build turns `src/` into this dictionary.** The tool listed the sources and
  chose the format. Change it only in two cases:
  - **A list of terms from code,** such as `FILE_ERROR_CODE`: splitting stores the parts instead of the whole terms,
    which saves space. Split only with `allowedSplitWords`, or misspellings come in. See
    [Splitting with `allowedSplitWords`](../dictionary-packages.md#splitting-with-allowedsplitwords).
  - **Words from a source that must be left out:** list them in a file under `excludeWordsFrom`. See
    [How a dictionary is built](../dictionary-packages.md#how-a-dictionary-is-built).
  - Check: the sources listed are the files in `src/`.
- **`cspell-ext.json`: what cspell loads.** It names this dictionary, describes it, and says when cspell enables it.
  The tool filled these in from your answers.
  - Check: the description says what words it covers, and `locale` and `languageId` match what you decided in step 2.
    See [Dictionary definitions](#dictionary-definitions) for the other fields.
- **`package.json`: what npm publishes.** The tool filled in the name, the descriptions, and the files to publish.
  - Add `keywords`: the words people type when they search npm, such as the language or tool and its other common
    names, like `golang` for Go.
  - Check that `files` lists the built dictionary, and every license file that came with a source.
  - Leave `private: true` and "-- Private until verified" as they are: a maintainer publishes this dictionary later.
- **`samples/`: real examples.** The tool doesn't create these. Add a few correctly spelled files of the kind this
  dictionary is for, such as Ruby scripts for a Ruby dictionary, or a page of prose for a language. They show that
  cspell turns the dictionary on for those files, and that real text passes. Add `"test:samples": "cspell samples"` to
  `package.json`'s scripts, and run it from `test`. See [Tests](../dictionary-packages.md#tests).
  - Check: each sample says where it came from, in `samples/README.md`.
- **`README.md`: the page people see on npm.** The tool wrote the title and the description.
  - Add a few sentences on what this dictionary covers and why to use it, for someone deciding whether to install it.
    See [Writing for users](../style.md#writing-for-users).
  - Keep the `@@inject` markers: a workflow fills them in after the PR lands.

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

- **Sets:** the directory, and from it the package name `@cspell/dict-<id>` and the dictionary ID `<id>`. The ID is the
  name in lowercase, with characters other than letters, digits, and `-` turned into `-`: `en_AU` gives `en-au`.
- **Values:** up to 50 letters, digits, `_`, and `-`. Names reserved on Windows, such as `con` or `aux`, aren't
  allowed.
- **Default:** none. It's required.
- **Errors:** `dictionaries/<name>/` already exists, or its package name or dictionary ID is already used by another
  dictionary. Giving the name both ways with different values is an error too.

#### Friendly name

`--friendly-name`. A readable name, such as `Australian English`.

- **Sets:** the `name` in `cspell-ext.json`, the title of the dictionary's README, and a keyword in `package.json`. It's
  the dictionary's title in the repo's README list.
- **Default:** the name, split at `-` and `_`, with each word capitalized: `medical_terms` gives `Medical Terms`. A
  natural language name like `en_AU` needs one: `--friendly-name "Australian English"`.

#### Description

`--description`. The words the dictionary covers, such as `Ruby keywords and standard library names`.

- **Sets:** the `description` in `cspell-ext.json` and in its dictionary definition, and the first line of the
  dictionary's README. It's shown in the repo's README list and in cspell's settings.
- **Default:** none. It's required, because only you know what the words are.
- **Errors:** the description is missing or empty.

#### npm description

`--package-description`. The description npm shows.

- **Sets:** the `description` in `package.json`, followed by " -- Private until verified" until a maintainer makes the
  dictionary public.
- **Default:** `<Friendly Name> dictionary for cspell.`, as most dictionaries on npm say. Change it only if npm should
  show something else.

#### Source file

`<path/to/source/words>` or `--source`. The files to build the dictionary from.

- **Values:** word lists, one word per line, usually `.txt` files; and Hunspell `.dic` files. A path is relative to
  where you run the command.
- **Several:** give several after the name, repeat `--source`, or both. They're combined, and word lists and Hunspell
  files can be mixed: `pnpm create-dictionary en_XX en_XX.dic extra-words.txt`.
- **Sets:** a copy of each file in the dictionary's `src/`, and each one as a source in `cspell-tools.config.yaml`. A
  Hunspell `.dic` brings its `.aff` file with it. Either file of the pair can be given, or both, and it counts as one
  source.
- **Errors:** a file doesn't exist (see [Missing source](#missing-source)), a Hunspell file is missing its pair, or two
  files have the same name and would both be copied to the same file in `src/`.

#### Missing source

`--allow-missing-source`. Start with an empty word list when there's no source yet.

- **Without a source:** it creates an empty `src/<name>.txt`.
- **With a source that doesn't exist:** it creates an empty file under that name in `src/`. Each source is checked on
  its own, so the others are still copied.
- **When asking:** a missing file asks whether to create it empty instead.
- It doesn't apply to Hunspell files, which must exist.

#### Locale

`--locale`. The languages that turn the dictionary on.

- **Values:** a language code with an optional region, such as `en` or `en-AU`. Separate several with commas:
  `en,en-AU`. `*` matches any language.
- **Sets:** `locale` in `cspell-ext.json`'s `languageSettings`.
- **Default:** `*`.
- **When to use it:** for a natural language dictionary. Leave the file type as `*`.

#### File type

`--language-id`. The file types that turn the dictionary on.

- **Values:** a VS Code language ID or file type, such as `java`, `cpp`, or `markdown`. Separate several with commas.
  `*` matches all file types. See [VS Code's language identifiers](https://code.visualstudio.com/docs/languages/identifiers).
- **Sets:** `languageId` in `cspell-ext.json`'s `languageSettings`.
- **Default:** `*`, unless the locale is `*` too. Then there's no default.
- **When to use it:** for any dictionary that isn't a natural language. Leave the locale as `*`.
- **Errors:** the locale and the file type are both `*`, which would turn the dictionary on for every file in every
  language.

#### Store as trie

`--trie` or `--no-trie`. How the built dictionary is stored.

- **`--trie`:** a compact format, much smaller for large lists. Use it for Hunspell files and for source files over
  about 1 MB.
- **`--no-trie`:** plain text, fine for smaller lists such as programming language keywords.
- **Default:** a trie for a Hunspell source, plain text otherwise.

#### Run build

`--build` or `--no-build`. Whether to build the dictionary right after creating it.

- **Default:** build a Hunspell source, and don't build a word list.
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
