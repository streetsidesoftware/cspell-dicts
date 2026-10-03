# Changing words in your browser

<!--
audience: GitHub web contributor
kind: guide
level: has a GitHub account; no terminal, no coding
-->

> [!NOTE]
> For anyone changing words in a dictionary on GitHub, in the browser. No terminal or coding needed.

It is fine to change several words in one PR, as long as they are related: the same dictionary, or the same concept.

> [!TIP]
> **Using an AI agent?** Copy this into a new session and fill in the brackets:
>
> ```text
> Change words in a cspell-dicts dictionary, following docs/guides/word-changes.md.
>
> Add: [words, one per line]
> Remove: [words, or "none"]
> Why: [where these words are used, with a link if you have one]
>
> Pick the dictionary as the guide says. To pick the source file, read the dictionary's src/README.md and the header
> comments at the top of its source files. Most new words go in src/additional_words.txt.
> Then sort, build, and test the dictionary, and open a PR that lists each word and why.
> ```

## 1. Find the dictionary

Pick the dictionary as described in [The dictionary](../word-lists.md#the-dictionary).

To see whether a dictionary already has a word, search the repo on GitHub, such as
`repo:streetsidesoftware/cspell-dicts path:dictionaries/ Sourcegraph`.

## 2. Find the source file

Open the dictionary's folder under
[`dictionaries/`](https://github.com/streetsidesoftware/cspell-dicts/tree/main/dictionaries), then its `src/` folder.
Pick the file as described in [The source file](../word-lists.md#the-source-file).

## 3. Edit the file

1. Open the file and select **Edit** (the pencil). If you can't write to the repo, GitHub offers to fork it.
2. Add, remove, or fix the words, following the [format](../word-lists.md#format). Add words anywhere: the list is
   sorted for you.
3. Select **Commit changes**, then **Propose changes**.

To remove a word that comes from an upstream source, don't edit anything: say so in the PR instead.

## 4. Open a PR

- Title it with `fix:` and the dictionary's folder name, such as `fix(companies): add Sourcegraph`.
- Say which words changed and why, with a source for words that aren't obvious.
- Leave **Allow edits by maintainers** checked, so the list can be sorted for you.

After you open it:

- autofix.ci sorts the list and commits the result to your PR.
- Leave `dict/` alone. The
  [Build Dictionaries](https://github.com/streetsidesoftware/cspell-dicts/actions/workflows/build-dictionaries.yml)
  workflow rebuilds it after your PR is merged.
