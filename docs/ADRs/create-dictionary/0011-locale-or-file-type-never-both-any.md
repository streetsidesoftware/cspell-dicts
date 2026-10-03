# 0011. A dictionary sets its locale or its file type, never both `*`

Status: Accepted

## Context

`languageSettings` in `cspell-ext.json` turns a dictionary on by `locale` and `languageId` (file type). `*` matches
any. The generator used to default both to `*`, which turns a dictionary on for every file in every language, so
users get its words wherever they spell check.

## Decision

We will set one of the two, depending on the kind of dictionary:

- A natural language dictionary sets `--locale`, such as `en-AU`, and leaves `--language-id` as `*`.
- Any other dictionary sets `--language-id`, such as `ruby`, and leaves `--locale` as `*`.

Both `*` is an error. With `--yes`, one of the two must be given. When prompting with the locale at `*`, the file type
has no default answer, and `*` is refused.

## Consequences

- A new dictionary is never on everywhere by accident. A dictionary that really should be on for everything isn't
  something the generator creates; that's a design decision for a maintainer.
- The new-dictionary guide and skill state the same rule.
