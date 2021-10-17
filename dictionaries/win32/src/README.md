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
