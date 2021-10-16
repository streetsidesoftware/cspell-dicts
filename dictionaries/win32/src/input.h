#define wchar_t short
#define _WCHAR_T_DEFINED
#define __int8 int
#define __int16 int
#define __int32 int
#define __int64 int
#define __cdecl
#define __pragma(x)
#define __inline
#define __forceinline
#define __ptr32
#define __ptr64
#define __unaligned
#define __stdcall
#define _stdcall
#define __alignof(x) 1

#ifndef UNICODE
#define UNICODE
#endif

#define __declspec(x)
#define _declspec(x)

// LPSZ: Long-pointer to null terminated string.
typedef void* lpsz;
// LPFN: Long-pointer to function
typedef void* lpfn;

#include <Windows.h>
#include <WinUser.h>
#include <winbase.h>
#include <d3d12.h>
#include <dxgi.h>
#include <d2d1.h>
