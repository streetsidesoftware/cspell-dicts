# 0002. Word lists and Hunspell files can be mixed in one dictionary

Status: Accepted

## Context

With several sources ([0001](./0001-name-and-sources-on-the-command-line.md)), a dictionary can be given both word
lists and Hunspell files. Existing dictionaries already do this: `en_AU` is compiled from a Hunspell `.dic`, its
`src/additional_words.txt`, and shared word lists. With `src/additional_words.txt` added by default
([0003](./0003-additional-words-file.md)), every Hunspell dictionary mixes the two unless it's turned off.

Today a Hunspell source makes the dictionary a trie, and builds it right away. The alternative weighed was to allow
either word lists or one Hunspell pair, which is simpler to explain but rules out dictionaries like `en_AU`.

## Decision

We will allow any mix of word lists and Hunspell files. All sources go into the one dictionary. If any source is a Hunspell file,
the defaults are a trie ([0012](./0012-when-a-dictionary-is-stored-as-a-trie.md)) and a build, as for a single Hunspell
source today.

## Consequences

- A natural language dictionary can be created with its Hunspell source and its word lists in one command.
- The defaults depend on the whole set of sources, not on the first one.
