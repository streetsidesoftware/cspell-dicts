# Win32 API names dictionary generator

Running `python generate.py` generates a new `win32.txt` in the current working directory containing all unique words found in a Windows SDK installation on the current machine, sorted alphabetically.

The process works by inspecting a compiler-generated C file that `#include`'s public Windows SDK header files and extracting its public declarations.

The tool also manually inspects all public SDK header files to extract `#define` declarations that where replaced away by the above step.

```
> python generate.py
```

# Requirements

## 1. Windows SDK

---

This generator also requires an installation of Windows SDK, available on the Visual Studio Installer, or over at https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/.

## 2. Python and [pycparser](https://github.com/eliben/pycparser)

---

This generator requires Python 3.5.0 and makes use of the [pycparser](https://github.com/eliben/pycparser) library to parse C headers, which is available on [pip](https://pypi.org/project/pip/):

```
> pip install pycparser
```

### Notes on pycparser and MSVC compatibility

While pycparser is meant to be a C99-compliant parser, Windows SDK makes use of MSVC-specific features on C/C++ header code which breaks compatibility with C99.

To overcome some of the parsing errors that can arise, `input.h` should `#define` away Microsoft-specific functionality so pycparser can once again parse the generate C header file.

When debugging parsing errors, the `inspect_output.py` script can be used to quickly inspect where the parsing errors are appearing in the `input.h.output` file.

For example, debugging a parsing error can be executed as follows:

```cmd
> python generate.py
[...]
pycparser.plyparser.ParseError: C:\\Program Files (x86)\\Windows Kits\\10\\include\\10.0.20348.0\\shared\\secext.h:113:11: before: return
```

Invoking `python inspect_output.py relative secext.h 113` outputs:

```cmd
> python inspect_output.py relative secext.h 113
input.h:38 (@ input.h.output:38)
secext.h:113 (@ input.h.output:490)
```

By navigating to input.h.output at line 490, as indicated by the last line of the output, you can investigate the MSVC-generated code and inspect the parsing issue at play.
