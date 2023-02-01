# Source Directory

All source files used to generate the dictionary should be stored in this directory.

## References

Open [the official docs](https://redis.io/commands/) and use `document.querySelectorAll` on the web console to grab all the commands:

```js
commands = [...document.querySelectorAll('article h1')];
words = commands.flatMap((x) => x.innerText.split(/ |\./));
[...new Set(words)].sort().join('\n');
```

This code is not very stable if they restyle their website.
