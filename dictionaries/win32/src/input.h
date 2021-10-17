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
#define __declspec(x)
#define _declspec(x)

#ifndef UNICODE
#define UNICODE
#endif

// Common name for precompiled header files on Windows (see https://stackoverflow.com/a/4726838)
typedef void* stdafx;

#include <Windows.h>
#include <WinUser.h>
#include <winbase.h>
#include <wchar.h>
#include <d3d12.h>
#include <dxgi.h>
#include <d2d1.h>
#include <d3d.h>
#include <dxgi1_6.h>
#include <d3dcompiler.h>
#include <shellapi.h>
#include <CommCtrl.h>
#include <appmgmt.h>
#include <appnotify.h>
#include <cpl.h>
#include <credentialprovider.h>
#include <dimm.h>
#include <imagetranscode.h>
#include <inputpanelconfiguration.h>
#include <intshcut.h>
#include <mobsync.h>
#include <objectarray.h>
#include <pathcch.h>
#include <profinfo.h>
#include <propkeydef.h>
#include <scrnsave.h>
#include <shappmgr.h>
#include <shdeprecated.h>
#include <shidfact.h>
#include <shimgdata.h>
#include <shlwapi.h>
#include <shtypes.h>
#include <storageprovider.h>
#include <syncmgr.h>
#include <thumbcache.h>
#include <thumbnailstreamcache.h>
#include <tlogstg.h>
#include <userenv.h>
