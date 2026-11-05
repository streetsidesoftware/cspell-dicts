# Design questions

<!--
audience: developer, maintainer
kind: reference
level: knows the repo's dictionaries and conventions
-->

> [!NOTE]
> For maintainers and developers working through a [design](./feature-design.md).

The questions a design covers, and where this repo's hard-to-undo decisions hide. Most changes touch two or three
groups. Go through those one question at a time. Spend time on a question when its answer could change the sketch or
would be hard to undo once it ships. Settle the rest with a proposed default, such as "the other dictionaries do Y".

## Why and who

Always first.

- Why are we doing this? What problem prompted it? Is there an issue?
- Why now: a bug report, a request, a limit hit while building something else?
- If the first answer is a solution ("we need a new dictionary"), ask why until the reason is clear.
- Who is affected, and how? Usually some of:
  - people who use cspell or the Code Spell Checker extension, and write `dictionaries`, `language`, or
    `languageSettings` in their config;
  - cspell itself, which bundles many of these dictionaries (`@cspell/cspell-bundled-dicts` in the cspell repo);
  - people who install a dictionary directly, or import `@cspell/dict-cspell-bundle`;
  - upstream projects whose word lists a dictionary copies;
  - maintainers of this repo.
- What does success look like, as text that's checked correctly or a setting a user can write, that isn't possible
  today?
- What's out of scope?

## cspell's fixed rules

What cspell fixes and this repo can't change. The sketch has to fit them. Check each one rather than assuming it.

- How a dictionary's `cspell-ext.json` is loaded (import, or bundled with cspell), and what that enables without the
  user doing anything.
- How `languageSettings` matches `languageId` and `locale`, and how users enable and disable dictionaries.
- What cspell-tools can build: formats, `split`, `allowedSplitWords`, `excludeWordsFrom`, Hunspell input.

## Principles

Check the sketch against the [design principles](./design-principles.md):

- **A dictionary doesn't depend on its upstream.** Does anything need the upstream to exist at build time?
- **Every source can be traced.** Is each source's origin and license written down and published?
- **Names are public from the first release.** Is any name still provisional?
- **A dictionary is enabled only where its words are right.** Does this accept words that should be flagged elsewhere?

If the change needs a new principle, agree on it before the decisions that depend on it.

## Names and IDs

- **Directory and package name.** `dictionaries/<name>`, published as `@cspell/dict-<name>`. Does it match related
  dictionaries?
- **Dictionary IDs.** One per dictionary package, or several (`python` and `python-common`)?
- **Renaming or splitting.** How do existing configs keep working? Is the old ID kept as an alias, and for how long?

## When it's enabled

- For which file types (`languageId`) and locales (`locale`)?
- Disabled by default, so users must add it to `dictionaries`? Or enabled for every file of a type?
- Does enabling it accept words that should be flagged elsewhere?

## Sources and license

- Where do the words come from: a hand-kept list, documentation, an upstream word list, a generated list?
- How is an upstream source kept current: a `sync` script from npm or GitHub, pinned or following the latest?
- What is each source's license, and does it fit the dictionary's? A missing, unclear, or incompatible license stops
  the design until the maintainers decide.

## Build

- Plaintext or trie? What's the expected size?
- Does it need `split` and `allowedSplitWords`? Which files are allowed?
- Does it read from other dictionaries, or will others read from it? Which builds must run after a change?

## Tools

For a change to something contributors or maintainers run, such as `pnpm create-dictionary` or a `sync` script.

- Does it change what existing dictionaries contain?
- What's the option's name, and does it fit the existing ones?
- What happens when it fails, and does one failing dictionary hold back the others?

## Testing and samples

- Which samples or test files prove the dictionary works, and which words must still be flagged?
- Which edge cases (case, accents, compound words) need a sample?

## Release surface

- Is it `feat:` or `fix:`, and is it breaking (`!`)? What will the changelog line say to a cspell user? See
  [Commits and pull requests](./commits-and-pull-requests.md).
- Should it be added to `@cspell/dict-cspell-bundle`? Should cspell bundle it (a change in the cspell repo)?
