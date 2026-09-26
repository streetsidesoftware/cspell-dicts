# Interview guide

A menu of the decision points that recur in this repo, grouped by theme. Most features touch two or three groups. Ask
one question, resolve it, write it down (as an ADR if it's a real judgment call, or in another ADR's Context if it's a
detail), then move on.

Where a question has an obvious, low-stakes default given the rest of the repo, propose it up front ("I'd default to X
because the other dictionaries do Y. Any reason to differ here?"). That's still an ADR if the user could reasonably
have picked differently; it just makes the interview faster.

## 0. Why, stakeholders, and the goal (always first)

- Why are we doing this? What problem or pain prompted it? Is there an issue?
- Why now: a bug report, a request, a limit hit while building something else?
- If the first answer is a solution ("we need a new dictionary") rather than a reason, try the five whys. Stop as soon
  as the reason is clear.
- Who are the stakeholders, and how is each affected? In this repo that's usually:
  - people who use cspell or the Code Spell Checker extension, and write `dictionaries`, `language`, or
    `languageSettings` in their config;
  - cspell itself, which bundles many of these packages (`@cspell/cspell-bundled-dicts` in the cspell repo);
  - people who install a package directly, or import `@cspell/dict-cspell-bundle`;
  - upstream projects whose word lists a package copies;
  - maintainers of this repo.
- What does success look like, as text that is checked correctly or a setting a user can write, that isn't possible
  today?
- What's deliberately out of scope?

Record the answers in the feature's `README.md` before the first decision.

## 1. cspell's fixed rules

Before any option, list what cspell fixes and this repo can't change. Write them in the first ADR's Context. Check each
one rather than assuming it.

- How a package's `cspell-ext.json` is loaded (import, or bundled with cspell), and what that turns on without the user
  doing anything.
- How `languageSettings` matches `languageId` and `locale`, and how users turn dictionaries on and off.
- What cspell-tools can build: formats, `split`, `allowedSplitWords`, `excludeWordsFrom`, Hunspell input.

## 2. Names and IDs

- **Package directory and name.** `dictionaries/<name>`, published as `@cspell/dict-<name>`. Does it match related
  packages?
- **Dictionary IDs.** One per package, or several (`python` and `python-common`)? IDs are public as soon as they ship:
  users write them in their configs.
- **Renaming or splitting.** How do existing configs keep working? Is the old ID kept as an alias, and for how long?

## 3. When it's on

- For which file types (`languageId`) and locales (`locale`)?
- Off by default, so users must add it to `dictionaries`? Or on for every file of a type?
- Does turning it on accept words that should be flagged elsewhere (false negatives)?

## 4. Sources and license

- Where do the words come from: a hand-kept list, documentation, an upstream word list, a generated list?
- How is an upstream source kept current: a `sync` script from npm or GitHub, pinned or following the latest?
- What is each source's license, and does it fit the package's? A missing, unclear, or incompatible license stops the
  design until the maintainers decide.

## 5. Build

- Plaintext or trie? What's the expected size?
- Does it need `split` and `allowedSplitWords`? Which files are allowed?
- Does it read from other packages, or will other packages read from it? Which builds must run after a change?

## 6. Testing and samples

- Which samples or test files prove the dictionary works, and which words must still be flagged?
- Which edge cases (case, accents, compound words) need a sample?

## 7. Release surface

- Is it `feat:` or `fix:`, and is it breaking (`!`)? What will the changelog line say to a cspell user?
- Should it be added to `@cspell/dict-cspell-bundle`? Should cspell bundle it (a change in the cspell repo)?
- Is any name still provisional? List it in the feature index, with when it must be decided.

## Wrapping a topic into a decision

Not every answer needs its own ADR. Bundle answers from the same group when they only make sense read together (a
package's name and its IDs). Split them when they can change independently later (a dictionary's IDs, and which file
types turn it on).
