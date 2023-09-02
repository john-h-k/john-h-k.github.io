# DirectDrawSurface (DDS) files

DDS (DirectDrawSurface) files are a common texture format, which are really well suited to GPUs and support pretty much everything you could want in a texture. Unfortunately, the documentation for them is very lacking, and you have to piece it together from the various open-source DDS loaders across the internet. I wrote this to try and put that info in one nice neat place.

## Metadata

All data is little-endian.

The very first element in a DDS file is a 4 byte magic number - `0x20534444` in hex, `542327876` in decimal, which is the ASCII string `"DDS "`. That is a space (ASCII value 32), not a null char at the end.

After this, there is the DDS file header. The structure looks like this (`uint` is a 32 bit little endian unsigned integer):

```cs
struct DDSHeader
{
    uint Size;
    HeaderFlags Flags;
    uint Height;
    uint Width;
    uint PitchOrLinearSize;
    uint Depth; // only if DDS_HEADER_FLAGS_VOLUME is set in flags
    uint MipMapCount;
    uint Reserved1[11];
    DDSPixelFormat DdsPixelFormat;
    uint Caps;
    Caps2Flags Caps2;
    uint Caps3;
    uint Caps4;
    uint Reserved2;
}
```

`HeaderFlags` and `Caps2Flags` are enums defined as such:

```cs
enum HeaderFlags : uint
{
    DDS_CAPS = 0x1,
    DDS_HEIGHT = 0x2,
    DDS_WIDTH = 0x4,
    DDS_PITCH = 0x8,
    DDS_PIXELFORMAT = 0x1000,
    DDS_MIPMAPCOUNT = 0x20000,
    DDS_LINEARSIZE = 0x80000,
    DDS_DEPTH = 0x800000,
    DDS_HEADER_FLAGS_VOLUME = 0x00800000,
}

enum Caps2Flags : uint
{
    DDS_CUBEMAP_POSITIVEX = 0x00000600, // DDSCAPS2_CUBEMAP | DDSCAPS2_CUBEMAP_POSITIVEX
    DDS_CUBEMAP_NEGATIVEX = 0x00000a00, // DDSCAPS2_CUBEMAP | DDSCAPS2_CUBEMAP_NEGATIVEX
    DDS_CUBEMAP_POSITIVEY = 0x00001200, // DDSCAPS2_CUBEMAP | DDSCAPS2_CUBEMAP_POSITIVEY
    DDS_CUBEMAP_NEGATIVEY = 0x00002200, // DDSCAPS2_CUBEMAP | DDSCAPS2_CUBEMAP_NEGATIVEY
    DDS_CUBEMAP_POSITIVEZ = 0x00004200, // DDSCAPS2_CUBEMAP | DDSCAPS2_CUBEMAP_POSITIVEZ
    DDS_CUBEMAP_NEGATIVEZ = 0x00008200, // DDSCAPS2_CUBEMAP | DDSCAPS2_CUBEMAP_NEGATIVEZ

    DDS_CUBEMAP_ALLFACES = DDS_CUBEMAP_POSITIVEX | DDS_CUBEMAP_NEGATIVEX |
                            DDS_CUBEMAP_POSITIVEY | DDS_CUBEMAP_NEGATIVEY |
                            DDS_CUBEMAP_POSITIVEZ | DDS_CUBEMAP_NEGATIVEZ,
    DDS_CUBEMAP = 0x00000200
}
```

`DDSPixelFormat` is another struct, which describes the format of the pixels (wow what a suprise!). `PixelFormatFlags` is just another enum, and then `D3DFormat` is a hellish `uint` enum that represents legacy `D3DX` format types. For any modern usage, you have to translate these into `DXGI_FORMAT` types

```cs
struct DDSPixelFormat
{
    uint Size;
    PixelFormatFlags Flags;
    D3DFormat FourCC;
    uint RgbBitCount;
    uint RBitMask;
    uint GBitMask;
    uint BBitMask;
    uint ABitMask;
}

enum PixelFormatFlags : uint
{
    DDS_FOURCC = 0x00000004,
    DDS_RGB = 0x00000040,
    DDS_LUMINANCE = 0x00020000,
    DDS_ALPHA = 0x00000002
}

enum D3DFormat : uint
{
    D3DFMT_UNKNOWN = 0,

    D3DFMT_R8G8B8 = 20,
    D3DFMT_A8R8G8B8 = 21,
    D3DFMT_X8R8G8B8 = 22,
    D3DFMT_R5G6B5 = 23,
    D3DFMT_X1R5G5B5 = 24,
    D3DFMT_A1R5G5B5 = 25,
    D3DFMT_A4R4G4B4 = 26,
    D3DFMT_R3G3B2 = 27,
    D3DFMT_A8 = 28,
    D3DFMT_A8R3G3B2 = 29,
    D3DFMT_X4R4G4B4 = 30,
    D3DFMT_A2B10G10R10 = 31,
    D3DFMT_A8B8G8R8 = 32,
    D3DFMT_X8B8G8R8 = 33,
    D3DFMT_G16R16 = 34,
    D3DFMT_A2R10G10B10 = 35,
    D3DFMT_A16B16G16R16 = 36,

    D3DFMT_A8P8 = 40,
    D3DFMT_P8 = 41,

    D3DFMT_L8 = 50,
    D3DFMT_A8L8 = 51,
    D3DFMT_A4L4 = 52,

    D3DFMT_V8U8 = 60,
    D3DFMT_L6V5U5 = 61,
    D3DFMT_X8L8V8U8 = 62,
    D3DFMT_Q8W8V8U8 = 63,
    D3DFMT_V16U16 = 64,
    D3DFMT_A2W10V10U10 = 67,

    D3DFMT_UYVY = 1498831189, // MAKEFOURCC('U', 'Y', 'V', 'Y'),
    D3DFMT_R8G8_B8G8 = 1195525970, // MAKEFOURCC('R', 'G', 'B', 'G'),
    D3DFMT_YUY2 = 844715353, // MAKEFOURCC('Y', 'U', 'Y', '2'),
    D3DFMT_G8R8_G8B8 = 1111970375, // MAKEFOURCC('G', 'R', 'G', 'B'),
    D3DFMT_DXT1 = 827611204, // MAKEFOURCC('D', 'X', 'T', '1'),
    D3DFMT_DXT2 = 844388420, // MAKEFOURCC('D', 'X', 'T', '2'),
    D3DFMT_DXT3 = 861165636, // MAKEFOURCC('D', 'X', 'T', '3'),
    D3DFMT_DXT4 = 877942852, // MAKEFOURCC('D', 'X', 'T', '4'),
    D3DFMT_DXT5 = 894720068, // MAKEFOURCC('D', 'X', 'T', '5'),

    D3DFMT_D16_LOCKABLE = 70,
    D3DFMT_D32 = 71,
    D3DFMT_D15S1 = 73,
    D3DFMT_D24S8 = 75,
    D3DFMT_D24X8 = 77,
    D3DFMT_D24X4S4 = 79,
    D3DFMT_D16 = 80,

    D3DFMT_D32F_LOCKABLE = 82,
    D3DFMT_D24FS8 = 83,

    D3DFMT_D32_LOCKABLE = 84,
    D3DFMT_S8_LOCKABLE = 85,

    D3DFMT_L16 = 81,

    D3DFMT_VERTEXDATA = 100,
    D3DFMT_INDEX16 = 101,
    D3DFMT_INDEX32 = 102,

    D3DFMT_Q16W16V16U16 = 110,

    D3DFMT_MULTI2_ARGB8 = 827606349, // MAKEFOURCC('M','E','T','1'),

    D3DFMT_R16F = 111,
    D3DFMT_G16R16F = 112,
    D3DFMT_A16B16G16R16F = 113,

    D3DFMT_R32F = 114,
    D3DFMT_G32R32F = 115,
    D3DFMT_A32B32G32R32F = 116,

    D3DFMT_CxV8U8 = 117,

    D3DFMT_A1 = 118,
    D3DFMT_A2B10G10R10_XR_BIAS = 119,
    D3DFMT_BINARYBUFFER = 199,

    D3DFMT_FORCE_DWORD = 0x7fffffff
}

```


If `header.DdsPixelFormat.Flags` has the `DDS_FOURCC` flag set, and the `header.DdsPixelFormat.FourCC` value is `'DX10'`, then the DDS 10 header is also present directly afterwards.

```cs
struct DDSHeaderDxt10
{
    DXGI_FORMAT DxgiFormat;
    D3D11_RESOURCE_DIMENSION ResourceDimension;
    D3D11_RESOURCE_MISC_FLAG MiscFlag;
    uint ArraySize;
    uint MiscFlags2;
}
```