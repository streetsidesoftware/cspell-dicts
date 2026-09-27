# Style

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
- Never edit between `@@inject` markers. Change the source and run `pnpm run build:readme`. See
  [Generated files](./build-and-packaging.md#generated-files).
- In a Markdown file with deliberate misspellings, list them in a `cspell:ignore` comment at the end of the file.

## Docs for people

`docs/` and `CONTRIBUTING.md` are written for people. In a guide, give each step a heading and list its checks one per
item.
