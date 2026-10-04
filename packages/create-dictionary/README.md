# create-dictionary

Creates a dictionary package in `dictionaries/<name>/`. Internal to the
[cspell-dicts](https://github.com/streetsidesoftware/cspell-dicts) repository; not published.

## Usage

From anywhere in the repository:

```sh
pnpm install
pnpm create-dictionary
```

It asks a few questions and creates the package in `dictionaries/<name>/`. Each answer can also be given as an option,
and `--yes` runs it without questions. Run `pnpm create-dictionary --help` to list the options. See
[Creating a dictionary](https://github.com/streetsidesoftware/cspell-dicts/blob/main/docs/guides/new-dictionary.md).

## Options for tests

`--root <dir>` creates the dictionary in another checkout of the repository, and `--skip-install` skips `pnpm install`
in it. The tests use them to create dictionaries in a temporary folder without changing `pnpm-lock.yaml`. They're
hidden from `--help`.

## License

MIT. See [LICENSE](./LICENSE).
