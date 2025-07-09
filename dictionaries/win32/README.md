# CSpell Win32 Dictionary

Win32 dictionary for cspell.

This is a pre-built dictionary for use with cspell.

<!--- @@inject: ../../static/requirements.md --->

<!--- @@inject: ./static/install.md --->

## Enable the Dictionary

By default the `win32` dictionary is enabled for `C` and `C++` file types. To enable it for other file types, it is necessary to add it to the `dictionaries` section of the configuration or include it as an inline CSpell directive: `cspell:dictionaries win32`.

Example: `example.md`

````markdown
Sample Code:

```cpp
    // Parse the command line parameters
    int argc;
    LPWSTR* argv = CommandLineToArgvW(GetCommandLineW(), &argc);
    pSample->ParseCommandLineArgs(argv, argc);
    LocalFree(argv);
```

<!--- cspell:dictionaries win32 --->
````

<!--- @@inject: ../../static/contributing.md --->

## License

MIT

> Some packages may have other licenses included.

<!--- @@inject: ../../static/footer.md --->
