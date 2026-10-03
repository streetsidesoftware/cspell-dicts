# 0007. Every new dictionary gets `src/exclude_words.txt`

Status: Accepted

## Context

The build generates words from a dictionary's sources: prefixes and suffixes are added to Hunspell stems, and word lists
can be split into parts. Sometimes it generates words we don't want. `excludeWordsFrom`, a target option in
`cspell-tools.config.yaml`, names files of words to leave out of the built dictionary, so those words are excluded
explicitly. It's also how a word that comes from an upstream source is removed: deleting it from the synced files
doesn't last, because the next sync brings it back.

10 dictionaries use it today, with three file names: `src/exclude-words.txt` (6), `src/exclude-terms.txt` (3), and
`src/exclude_words.txt` (1). Because most dictionaries have no such file, and the rest name it differently, the
word-changes guide can't give one instruction for removing a word that comes from upstream.

Options weighed:

- Always create it, with no way to leave it out. An empty file costs nothing at build time.
- Create it only for dictionaries with a third-party source. Fewer files, but the guide's instruction then depends on the
  dictionary.

## Decision

We will create `src/exclude_words.txt` in every new dictionary, with a header saying what belongs in it, and list it
under the target's `excludeWordsFrom`. `--no-exclude-words` leaves it out, as `--no-additional-words` does for
[0003](./0003-additional-words-file.md).

## Consequences

- The word-changes guide can say "add it to `src/exclude_words.txt`" for every new dictionary.
- The name matches `src/additional_words.txt`. Existing dictionaries move to it over time; that's out of scope here.
