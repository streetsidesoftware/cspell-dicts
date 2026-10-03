# create-dictionary

Creates a dictionary package in `dictionaries/<name>/`. Internal to the
[cspell-dicts](https://github.com/streetsidesoftware/cspell-dicts) repository; not published.

## Usage

From the repository root:

```sh
pnpm install
pnpm run create-dictionary
```

From inside another package, use `pnpm -w run create-dictionary`.

It asks a few questions and creates the package in `dictionaries/<name>/`. Each answer can also be given as an option,
and `--yes` runs it without questions. Run `pnpm run create-dictionary --help` to list the options. See
[Creating a dictionary](https://github.com/streetsidesoftware/cspell-dicts/blob/main/docs/guides/new-dictionary.md).

## License

MIT. See [LICENSE](./LICENSE).
