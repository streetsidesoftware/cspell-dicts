# Creating a dictionary

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
- **Dictionary IDs:** usually the same name. A package can define more than one.
- **When it's on:** for which file types (`languageId`) and which locales (`locale`) `languageSettings` turns it on,
  or whether users must add it to `dictionaries` themselves.
- **Format:** plaintext, or a trie for large lists such as Hunspell dictionaries.

If more than one answer is reasonable and the choice would be hard to undo, record it as an ADR. See
[ADRs](../ADRs/README.md).

## 3. Check the sources and their license

- Where do the words come from? Your own list, a project's documentation, or an upstream word list?
- What is the source's license? The package's `license` field and `LICENSE` must allow it, and upstream license files
  are published with the package (added to `files`). The generator writes an MIT `LICENSE`: change it if the source
  requires.
- If the license is missing or unclear, stop and ask the maintainers in an issue before going further.

For an upstream word list, also read [Upstream updates](./upstream-updates.md): the package gets a `sync` script.

## 4. Run the generator

Check the [prerequisites](../build-and-packaging.md#prerequisites). Then, from the repo root:

```sh
pnpm install
pnpm run prepare:dictionaries
pnpm run create-dictionary
```

Or pass the name and the source file:

```sh
pnpm run create-dictionary <name> <path/to/source/words>
```

It asks:

| Field         | Description                                                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | The package directory name, such as `en_AU` or `ruby`.                                                                                                                                                  |
| friendly name | A readable name, such as `Australian English`.                                                                                                                                                          |
| description   | A short description of the dictionary.                                                                                                                                                                  |
| source file   | The file to build the dictionary from: a `.txt` word list or a Hunspell `.dic` file. It is copied into the package's `src/`.                                                                            |
| locale        | The language code with an optional region, such as `en` or `en-AU`. Separate several with commas. `*` matches any language.                                                                             |
| languageId    | The VS Code language ID or file type, such as `java`, `cpp`, or `markdown`. `*` matches all file types. See [VS Code's language identifiers](https://code.visualstudio.com/docs/languages/identifiers). |
| store as trie | `y` for large source files (over about 1 MB) and Hunspell files. `n` works for programming language keyword files.                                                                                      |
| run build     | Build the dictionary now. You can also run `pnpm run build` in the package later.                                                                                                                       |

It creates `dictionaries/<name>/` with `version` `1.0.0` and `private: true`, so the package isn't published until you
say so.

## 5. Fill in the package

- **`src/`:** the word lists, formatted as in [Word changes](./word-changes.md#format).
- **`cspell-tools.config.yaml`:** the targets and their sources. Set `split` and `allowedSplitWords` for lists of
  identifiers, and `excludeWordsFrom` if some upstream words must be left out. See the [Glossary](../glossary.md).
- **`cspell-ext.json`:** the dictionary definitions and `languageSettings`, as decided in step 2. See
  [Dictionary definitions](#dictionary-definitions).
- **`package.json`:**
  - Remove "-- Private until verified" from `description`.
  - Add `keywords` for the language or tool and its common alternate names.
  - Check that `files` lists every built file and any upstream license file.
  - Check that the `test` script spell checks the samples or source with the dictionary.
  - Run `pnpm update-package-json dictionaries/<name>/package.json` from the repo root. It sets `repository`,
    `author`, and `publishConfig`, and sorts the fields.
- **`samples/`:** correctly spelled files of the kind the dictionary is for. The `test` script checks them.
- **`README.md`:** what the dictionary covers and why to use it, for someone installing it. Keep the `@@inject` markers
  from the template. See [Style](../style.md#writing-for-users).

## 6. Build and test

In the package:

```sh
pnpm run build
pnpm test
```

Then, from the repo root, generate the README sections and fix formatting:

```sh
pnpm run build:readme
pnpm run lint
```

Checks:

- `dict/` holds the built files, and they look right.
- `pnpm test` passes.
- The README's install and configuration sections were filled in by `build:readme`.
- `pnpm run lint` leaves no errors.

## 7. Try it with cspell

From the package directory, link the dictionary into your global cspell config:

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

## 8. Make it public and open a PR

- Set `private` to `false` in `package.json`, once the dictionary is ready to publish.
- Don't add the package to `.release-please-manifest.json`. See [Releasing](../releasing.md#rules).
- To include it in `@cspell/dict-cspell-bundle`, add it to `dependencies` in `dictionaries/cspell/package.json` as
  `"workspace:^"`, then run `pnpm run build` in `dictionaries/cspell`. Whether cspell itself bundles it is decided in
  the [cspell](https://github.com/streetsidesoftware/cspell) repo.
- Use a `feat(<name>): add <friendly name> dictionary` title. See
  [Commits and pull requests](../commits-and-pull-requests.md).

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
