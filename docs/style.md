# Style

<!--
audience: technical contributor, developer, maintainer
kind: reference
level: writes word lists, READMEs, or docs in this repo
-->

> [!NOTE]
> For anyone writing word lists, a dictionary's README, or docs in this repo.

Prettier and ESLint handle formatting (`pnpm run lint` fixes what it can). Beyond that:

## Comments

Keep the mental cost of reading the code low. The code is the source of truth. A few accurate comments are better than
many long ones that drift out of date.

- Don't explain what the code does when the code already shows it. Explain why, only when it isn't obvious.
- A comment should never take longer to read than the code it describes.
- Don't discuss rejected alternatives, and give a reason once, not in every place it applies.
- Keep comment lines to 140 characters or fewer.
- Leave existing comments alone unless you are changing that code, or you are asked to.

In a word list, a `#` comment can say where a group of words comes from or what it covers. See
[Word changes](./guides/word-changes.md#format).

## Invisible characters

In code, config, and docs, write invisible and non-printing characters as escape sequences (`\u00a0`, `\u200b`,
`\u2028`), including in strings and regular expressions. A literal invisible character can't be seen in a review, and
editors can silently change it.

Dictionary data is the exception. Word lists in `src/`, built files in `dict/`, and files synced from upstream hold
words exactly as they are written in their language, which can include characters such as a no-break space. Keep them
literal, and don't flag them in review.

## Writing for users

These rules apply to the root `README.md`, every `dictionaries/*/README.md`, and `feat:`/`fix:` PR descriptions.

- Write for someone installing and using the dictionary, not for a contributor.
- A package's `README.md` is also its npmjs.com page, where relative links break. Use absolute `https://` URLs for
  every link and image. Links to anchors on the same page (`#configuration`) are fine.
- Don't start a sentence with a code span. Lead with a word: "Add `python` to `dictionaries`…".
- Label an example that is a whole file with its filename in bold, directly above the code block, for example
  **`cspell.json`** or **`.vscode/settings.json`**.
- Never edit between `@@inject` markers. Change the source: the Update README workflow regenerates them after the PR
  lands. See [Generated files](./repository.md#generated-files).
- In a Markdown file with deliberate misspellings, list them in a `cspell:ignore` comment at the end of the file.

## Docs for people

`docs/` and `CONTRIBUTING.md` are written for people. In a guide, give each step a heading and list its checks one per
item.

The entry point is `CONTRIBUTING.md`: it links to the docs, and no doc links back to it.

### Audience

Each doc is written for a clear target audience, named in a header right below its title. List more than one audience
only when the doc serves each of them:

```markdown
# Creating a dictionary

<!--
audience: technical contributor
kind: guide
level: comfortable with basic git and a terminal; doesn't read or write code
-->

> [!NOTE]
> For contributors who can fork the repo and follow terminal steps. No coding needed.
```

The HTML comment is for writers and AI agents; GitHub doesn't show it. The `> [!NOTE]` below it tells readers whether
the doc is for them. A maintainer-only doc uses `> [!WARNING]` instead, to warn others off. Write for the reader the
header names, and leave out what they don't need.

**Audiences:**

- **CSpell user:** uses the dictionaries in cspell or VS Code, and reads package READMEs. Has no clone.
- **GitHub web contributor:** works only in GitHub's web UI: files issues, edits a file in the web editor, and opens
  PRs. No clone, no terminal.
- **Technical contributor:** forks and clones the repo, and runs the steps in a terminal. Knows basic git. Doesn't read
  or write code, and is willing to follow clear steps.
- **Developer:** reads and writes the repo's scripts, configs, and workflows.
- **Maintainer:** has write access. Reviews, merges, publishes, and runs the repo's maintenance.

**Kinds:**

- **Guide:** steps to follow, in order, for one task.
- **Reference:** facts to look up, such as a layout, rules, or terms.

**Level:** what the reader is expected to know or be able to do, in a few words.
