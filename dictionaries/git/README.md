# CSpell Git Configuration

Configuration for spell checking Git Commit messages.

<!--- @@inject: ../../static/requirements.md --->

<!--- @@inject: ./static/install.md --->

<!--- @@inject: ../../static/contributing.md --->

## Usage commit-msg

**`.git/hooks/commit-msg`**

```sh
#!/bin/sh

exec npx cspell --language-id commit-msg $1
```

## License

MIT

> Some packages may have other licenses included.

<!--- @@inject: ../../static/footer.md --->
