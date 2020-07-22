# Bindings for .NET

This page lists open-source .NET projects which provide bindings to native libraries. Feel free to [contribute to this page](https://github.com/john-h-k/john-h-k.github.io/blob/master/bindings.md)

Go to the bottom of the page to search by a native DLL's name

* [dotnet/PInvoke](https://github.com/dotnet/pinvoke) - higher level bindings for a large proportion of Win32 libraries. Great for general use, althought not always as performant as alternatives - targets .NET standard 2.0

* [ClangSharp](https://github.com/microsoft/ClangSharp) - low level blittable bindings and a higher level C# API for Clang - targets .NET standard 2.0

* [LLVMSharp](https://github.com/microsoft/LLVMSharp) - low level blittable bindings and a higher level C# API for LLVM - targets .NET standard 2.0

* [TerraFX.Interop.Windows](https://github.com/terrafx/terrafx.interop.windows) - Raw bindings for Win32 (user32, kernel32) and many COM libraries (SAPI, DirectX10, 11, 12, DXGI, D2D, DWrite, DirectML, WASAPI, XAudio2), with zero managed marshalling and only blittable signatures. Can require more elbow grease to use, but have blindingly fast performance in exchange - requires .NET 5

* [TerraFX.Interop.Vulkan](https://github.com/terrafx/terrafx.interop.vulkan) - Raw bindings for vulkan - similarly to `TerraFX.Interop.Windows`, these provide identical interfaces to the C APIs, which allow for zero-overhead use of these APIs

* [PySharp](https://github.com/john-h-k/PySharp) - Blittable bindings for Python3's C API - requires .NET 5 and is an early alpha

* [Silk.NET](https://github.com/Ultz/Silk.NET) - Blittable and managed bindings for a variety of multimedia based libraries, including ASSIMP, OpenGL, Vulkan, SDL, GLFW, OpenXR, and more - targets .NET standard 2.0

* [IMGUI.NET](https://github.com/mellinoe/ImGui.NET) - An older mixed managed/unmanaged library providing bindings for the IMGUI C API - targets .NET standard 2.0

* [PIX.NET](https://github.com/john-h-k/PIX.NET) - Bindings for PIX, the windows graphics/ML debugging tool, that closely imitate the native `pix3.h` bindings - targets - requires .NET 5

<details>
    <summary>Search by a native DLL name</summary>
    TODO
</details>