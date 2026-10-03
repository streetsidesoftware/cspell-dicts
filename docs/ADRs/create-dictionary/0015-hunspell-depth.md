# 0015. Hunspell sources default to a depth of 1

Status: Accepted

## Context

`maxDepth` limits how many Hunspell affix rules are chained onto a stem when the build reads a `.dic` and `.aff`.
Unset, `hunspell-reader` uses 5; 0 means stems only. The template set `maxDepth: 1` on every source, "to prevent
initial builds from taking too long", including word lists, where it means nothing; that was a workaround for Yeoman's
templates.

Its effect depends on the language, and can't be predicted:

- For some dictionaries, depths above 1 add no words.
- For some, 1 and 5 build in about the same time.
- For some, a depth above 1 makes the build take hours or run out of memory.
- For Hebrew, even 1 is too much; `he` uses 0.

Hunspell's own manual says it strips at most two suffixes and one prefix (or two prefixes and one suffix with
`COMPLEXPREFIXES`), so depths beyond that only follow continuation classes further than Hunspell itself would.

Since [0013](./0013-new-dictionaries-are-built.md) builds every new dictionary, the default has to be safe rather than
complete: a default that explodes for some language makes `create-dictionary` hang or crash. Leaving it unset, so 5
applies, was weighed and rejected for that reason.

## Decision

We will:

- **Set no `maxDepth` on word lists.**
- **Default Hunspell sources to `maxDepth: 1`,** with a comment that says what it means: higher depths can add word
  forms, but can make the build very slow or run out of memory, so raise it only after checking.
- **Add `--hunspell-depth <n>`** to set it when the dictionary is created, for a language whose depth is already known,
  such as 0 for Hebrew.

## Consequences

- Creating a dictionary never hangs on an explosive language.
- A natural language dictionary may be missing forms that need two chained rules until a maintainer raises the depth.
  Finding the right depth is tuning, not creation; it's out of scope here, and could be a later tool that builds at
  increasing depths and compares word counts.

<!-- cspell:ignore COMPLEXPREFIXES -->
