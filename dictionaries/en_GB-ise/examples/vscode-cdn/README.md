# VSCode: Using `@cspell/dict-en-gb-ise` via CDN

`.vscode/settings.json`
```json
{
  "cSpell.language": "en-gb",
  "cSpell.import": ["https://cdn.jsdelivr.net/npm/@cspell/dict-en-gb-ise@latest/cspell-ext.json"]
}
```

This is some text.

colour is the right word.

realisation is also right.

Make sure words such as don’t , couldn’t are being marked as correct.
as well as don't and couldn't.

Tell the spell checker to ignore possessive 's
cspell:ignoreRegExp possessive_s

Be sure to ignore: squishy's plushy'S

This word should be misspelled: industrialize.
cspell:ignore industrialize
