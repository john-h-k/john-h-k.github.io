# Nano-COM

## Table Of Contents

* [COM vs Nano-COM](COM%20vs%20Nano-Com)
* [IUnknown](IUnknown)
* [Reference Counting](Reference%20Counting)
* [PrivateDate and object names](PrivateData%20and%20object%20names)
* [IIDs and CLSIDs](IIDs%20and%20CLSIDs)
* [QueryInterface](QueryInterface)
* [Versioning](Versioning)
* [HRESULTs](HRESULTs)
* [COM pointer types](COM%20pointer%20types)
* [Debugging COM leaks](Debugging%20%COM%20leaks)

## COM vs Nano-COM

* COM stands for Common Object Model, and is a programming interface standard made by microsoft. It is complex and extends massively beyond what is relevant to DirectX, and we won't cover advanced COM topics (like `CoCreateInstance` and COM servers) here as they are irrelevant to DirectX. However, a solid understanding of nano-COM is essential to writing good DirectX code.

DirectX uses a interface model referred to casually as "Nano-COM", which utilises the ABI (application-binary interface - a topic for another article, but basically how different programs interact on a binary level, e.g parameter passing, errors, etc), as well as the error-code model of COM.

As anyone who has worked with COM or Win32 before will know, windows loves its `typedef`s. Not too many are essential to know, but a few are frequently used in COM code:

* `REFGUID` - GUID pointer in C/C#, GUID reference in C++
* `UINT/ULONG` - 32 bit unsigned int
* `LPVOID` - `void*`
* `HRESULT` - 32 bit signed int used as error code (sign bit indicates failure (negative num) or success (positive num))

## IUnknown

`IUnknown` is the base interface of all COM types. Everything derives from it, and DirectX interfaces are no exception. This interface has 3 methods, which allow reference counting and inheritance/aggregation, and are the core methods required to manage arbitrary COM objects. (All these methods must be thread safe)

```cpp
UINT AddRef();
UINT Release();
HRESULT QueryInterface(REFGUID pIID, void** ppvObject);
```

All these methods will soon be explained - for now, just understand that any COM interface is implicitly convertable to an `IUnknown*`. Similar to Java's `Java.lang.Object` type or .NET's `System.Object` type, it acts as the base of all types in the ecosystem.

> Note: You always work through COM objects with pointers. Never ever derefence them (if your language allows it). You will get horrible object slicing and inevitable mem corruption. :(

## Reference Counting

COM objects are memory-managed by reference counting, where the COM object stores how many references to it exist to control its lifetime, and then destroys itself when there are non left (never use `delete` on a COM interface!). `AddRef` and `Release` are the 2 methods used for manipulating reference counts. `AddRef`, as the name suggests, increments the object's internal reference counter, and then it returns the *new* reference count. `Release` decrements the COM object's internal counter, and then it also returns the new reference count (note that the documentation for `IUnknown` says these return values should only be relied upon for testing purposes, and not for general code (it isn't your business how many references a COM object has!)). If the call to `Release` results in the counter decrementing to 0, then the COM object's lifetime ends, and it is destroyed. Any further calls on the object are undefined behaviour (you can't "revive" it with an `AddRef` call). It is worth noting that the D3D12 debug layer frequently will warn you of double-releasing an object, but often will simply crash if you invoke other methods on a destroyed object.

## PrivateDate and object names

Private data and object names are a DirectX concept, *not* a COM concept, but they are very much worth covering here. All D3D12 interfaces inherit from `ID3D12Object` (which in turn inherits from `IUnknown`), which contains the private data methods.
For completeness, all the DirectX "base" objects are:

* DXGI - `IDXGIObject`
* D3D11 - `ID3D11Device` and `ID3D11DeviceChild` (everything inherits from the latter *except* the former, which inherits from `IUnknown`)
* DML (Direct ML) - `IDMLObject`

All of these types have 3 methods.

```cpp
HRESULT GetPrivateData(REFGUID guid, UINT* pDataSize, void* data);
HRESULT SetPrivateData(REFGUID guid, UINT dataSize, const void* data);
HRESULT SetPrivateDataInterface(REFGUID guid, IUnknown* data);
```

`ID3D12Object` and `IDMLObject` usefully have a fourth method:

```cpp
HRESULT SetName(/* I hate this type name too. It is a WCHAR*. Just a UTF16 string I promise */ LPCWSTR Name);
```

This is just shorthand for `SetPrivateData` with `WKPDID_D3DDebugObjectNameW` (`WKPDID` means Well-Known Pointer to Data ID) GUID. For thin (non UTF16) strings, use `WKPDID_D3DDebugObjectName` and manual `SetPrivateData`.

These are effectively hashmap methods on every object, allowing you to store arbitrary data in them. The most common one by far is storing the object name, either via `SetName` or `WKPDID_D3DDebugObjectNameW`/`WKPDID_D3DDebugObjectName`, which debugging tools and the DirectX runtime recognise for error messages, which makes life easier. Just generate a new IID for the data you want to store and tada, you can attach it.

GUIDs are used for identifying the data, and are sometimes called DIDs (Data-IDs).

`SetPrivateData` sets data associated with a guid for retrieval later. Set `dataSize` to `0` and `data` to `NULL` to destroy associated data for a guid.

`SetPrivateDataInterface` allows you to associate other COM interfaces with an object, by passing it as an `IUnknown`. This way, each call to `GetPrivateData` will result in an `AddRef` so that reference counting still works. You use the standard `GetPrivateData` to retrieve it, with a size of `void*`, and then must `Release` the returned interface when finished with it. If the object you called `SetPrivateDataInterface` is destroyed, it calls `Release` on all its set interfaces, allowing you to associate lifetimes between objects.

`GetPrivateData`, when `pData` is `NULL`, writes the stored data size to the `pDataSize` parameter allowing you to determine the size if necessary (for an array or variable sized type). When `pData` is not `NULL`, if it is larger than the size of the stored data, the data will be written to `data` and then the amount of data written will be written to `pDataSize`.

E.g, to retrieve a fixed size structure and a name

```cpp
template <class T>
T RetrieveNamedData(ID3D12Object* pObj, REFGUID did)
{
    T val;
    UINT size = sizeof(val);
    if (FAILED(pObj->GetPrivateData(did, &size, &val)) || size != sizeof(val))
    {
        throw std::runtime_error(...);
    }
    return val;
}

std::wstring RetrieveName(ID3D12Object* pObj)
{
    REFGUID did = WKPDID_D3DDebugObjectNameW;
    UINT size = 0;
    if (FAILED(pObj->GetPrivateData(did, &size, nullptr)) || size == 0)
    {
        return L"Unnamed object";
    }

    std::wstring name(0, size);
    assert(SUCCEEDED(pObj->GetPrivateData(did, &size, name.data()))); // not thread safe example
    return name;
}
```

## IIDs and CLSIDs

* GUID = Globally Unique IDentifier
* IID = Interface IDentifier
* CLSID = CLass Identifier

A GUID isn't a COM concept, and just means Globally-Unique ID. They are just a 128 bit value to identify something. Because 2^128 is big (really big. really really big. really really really big), you can generally assume any generated GUID is unique. Visual Studio has an inbuilt generator for one, or use [guidgenerator](https://guidgenerator.com).

An IID is used to identify an interface programmatically, as a sort of crude RTTI system. For example, the IID of `IUnknown` is `00000000-0000-0000-C000-000000000046`, and the IID of `ID3D12Device` is `189819F1-1DB6-4B57-BE54-1821339B85F7`.

To retrieve an IID of an interface, in Visual C++ or C# (with `TerraFX.Interop.Windows`) you can use the `__uuidof` of operator to retrieve the interface.

You will commonly find the combination of an `IID` and a `void**` being used to represent some sort of COM interface output. The IID represents which interface you want to receive, and the `void**` is the
actual pointer to be outputted to. For example, `QueryInterface` uses this pattern.
To simplify it, there is a macro called `IID_PPV_ARGS` in `combaseapi.h`

A CLSID is similar to an IID, except it represents a concrete instance of a type rather than an interface. These aren't used in core DirectX but they *are* used by the DirectX Shader Compiler and so are worth briefly covering.

`DxcCreateInstance` is a factory method used to create interfaces, and it takes two IIDs (unlike factory methods like `D3D12CreateDevice`). One IID, to indicate the type you are representing it as (e.g, `DxcCompiler` is a valid `IDxcCompiler`, `IDxcCompiler2`, and `IDxcCompiler3`), and one CLSID to indicate which type you want to create to implement that interface (currently there is only one option for each interface as far as I know, but this could change).

```cpp
IDxcCompiler* compiler;
DxcCreateInstance(CLSID_DxcUtils, __uuidof(*compiler), CLSID_DxcCompiler);
```

```cpp
IUnknown* pUnk;
GUID unknown_iid = __uuidof(IUnknown);
// or
GUID unknown_iid = __uuidof(*pUnk);
```

```cs
IUnknown* pUnk;
Guid unknownIid = __uuidof<IUnknown>();
// or
Guid unknownIid = __uuidof(*pUnk);
```

You can also use the static IID definitions in the various DX header files, such as

```cpp
GUID unknown_iid = IID_IUnknown;
```

Doing this requires linking against `dxguid.lib`, unless you want your linker to kaboom.

## QueryInterface, inheritance, and aggregation

`QueryInterface` is the method used for casting safely between COM interfaces.
It is analagous to a slightly more restrictive version of `is/as` in C#, `instanceof` in Java/Python, and `dynamic_cast` in C++.

To recap, the signature is

```cpp
HRESULT QueryInterface(REFGUID iid, void** ppvObject);
```

This `IID` + `ppvObject` pattern pops up a lot, so there is a macro to help you. `IID_PPV_ARGS`, which is defined as roughly (it actually uses a complex fancy template, but this gets the point across):

```cpp
#define IID_PPV_ARGS(pObj) __uuidof(*(pObj)), (void **)(pObj)
```

You use it as such:

```cpp
IComInterfaceBlah* res = nullptr;
SomeIidPpvMethod(..., IID_PPV_ARGS(&res));
```

You can find this macro in `combaseapi.h` as well as in the DirectX-Headers and DirectXTK12 repos on github.

COM has both inheritance and aggregation, and uses `QueryInterface` to encompass both.
Inheritance here meaning identity conversions (so your pointer to an `ID3D12Device7` is actually also an `ID3D12Device4`), whereas aggregation simply means the interface may contain the desired interface as a field, meaning can only be accessed through `QueryInterface`
(your `ID3D12Devic4` might support `ID3D12Device7`, but it itself is not necessarily an `ID3D12Device7`).

The `iid` parameter is the IID of the interface you want. `ppvObject` is a pointer to the interface-pointer it will be outputted to.
Note: You can *never* safely downcast a COM pointer based on a `QueryInterface` result. Your `ID3D12Device` may implement `ID3D12Device1`, but not necessarily through the original pointer.
You can safely upcast where there is an explicit inheritance - e.g `ID3D12Device1` inherits from `ID3D12Device`, so it can be safely converted to an `ID3D12Device*`. However, an arbitrary `ID3D12Device`
may have been created in some way where its child interfaces are exposed through aggregation rather than inheritance, so the returned object could be different. However, because that interface *does* directly inherit from `ID3D12Device`, you can safely upcast it. It's a little bit to wrap your head around.

C++ has a convenience overload of `QueryInterface` which takes a typed `ppvObject` and gets the `IID` for you.

```cpp
template<class Q>
HRESULT QueryInterface(Q** pp)
{
    return QueryInterface(__uuidof(Q), (void **)pp);
}
```

`QueryInterface` can return 3 things. `E_POINTER`, meaning your `ppvObject` was `NULL` and so the call failed. `E_NOINTERFACE`, meaning the call succeeded but the interface could not be supplied (it isn't inherited or aggregated), and `ppvObject` has been set to `NULL`, or `S_OK` meaning it succeeded and `ppvObject` is set to the desired interface and had a reference added to it, and must be `Release`d when it is finished being used.

## Versioning

DirectX uses a very simple (but in my opinion, quite elegant) technique for versioning. Each new version of an interface just has an incrementing number attached to it. E.g `ID3D12Device`, `ID3D12Device1`, ..., all the way to `ID3D12Device9` now. As a general rule, `ID3D12FooN` inherits from `ID3D12Foo(N-1)`, and so you can safely upcast, but to get to `ID3D12FooN` from `ID3D12Foo(N+1)` you *must* `QueryInterface`. The exception is all the debug interfaces, (they all inherit from `IUnknown` instead! why!!! why!!!!. except `ID3D12Debug3`... which inherits from `ID3D12Debug`... just to make it more confusing).

This is one of the reasons most creation methods take an `IID` + `ppvObject`. Instead of doing

```cpp
ID3D12Resource* pTmp;
ID3D12Resource4* pRes;

ThrowIfFailed(device->CreateResource(..., &pTmp));
ThrowIfFailed(pTmp->QueryInterface(IID_PPV_ARGS(&pRes)));
pTmp->Release();
```

you can just do

```cpp
ID3D12Resource4* pRes;
ThrowIfFailed(device->CreateResource(..., IID_PPV_ARGS(&pRes)));
```

## HRESULTs

A `HRESULT` is a 32 bit signed integer representing an error or success code. The reason for the slightly strange naming is that it was originally a result-handle, rather than an error code, (like a `HWND` is a window-handle, a `HINSTANCE` is an instance-handle, a `HRESULT` was a result-handle). But that was too heavy and deemed unnecessary early on, so it became a 32 bit signed integer instead error code instead.

A `HRESULT` has 3 elements - a severity (error or success), a facility (where it comes from), and a code (what it is). The severity is the sign bit, where a 1 (negative number) means an error and a 0 (positive number) means a success. To inspect this bit, there are 2 macros in `winerror.h`:

```cpp
#define FAILED(hr) (((HRESULT)(hr)) < 0)
#define SUCCEEDED(hr) (((HRESULT)(hr)) >= 0)
```

There are `HRESULT_SEVERITY`, `HRESULT_FACILITY`, `HRESULT_CODE`, and `MAKE_HRESULT` macros too that are relatively self explanatory, but generally not used for DirectX.

There are only 2 success codes used by DirectX:

* `S_OK` - the value 0, the bog standard "yeah that worked" code
* `S_FALSE` - success, but "alternative" success. Most frequently used in DirectX for `CreateXXX(...)` methods, where the output object (`ppvObject`) is `NULL` and so object creation is *tested* for success rather than created. In this case, `S_FALSE` is returned for success

> Note: Every single `CreateXXX` method (including `D3D12CreateDevice`) can have a valid `IID` passed and a `NULL` `ppvObject` to test creation. This can be useful.

The important error codes to know are:

* `E_POINTER` - something is `null` that shouldn't be
* `E_FAIL` - something went wrong!
* `E_INVALIDARG` - ...pretty self explanatory
* `E_NOINTERFACE` - an interface could not be provided or wasn't supported
* `E_OUTOFMEMORY` - can either mean local (system) memory or device (GPU) memory is exhausted - local memory exhaustion is generally fatal, but device memory exhaustation often isn't

* `D3D12_ERROR_ADAPTER_NOT_FOUND` - you are trying to use a shader/pipeline cache from a different adapter
* `D3D12_ERROR_DRIVER_VERSION_MISMATCH` - you are trying to use a shader/pipeline cache (or serialized data) from a different driver version

* `DXGI_ERROR_INVALID_CALL` - returned sometimes by DXGI methods instead of `E_INVALIDARG`
* `DXGI_ERROR_WAS_STILL_DRAWING` - very specifically returned by `IDXGISwapChain::Present` with flag `DXGI_PRESENT_DO_NOT_WAIT`, when the call without the flag would have resulted in a wait

All of the following indicate device removal:

* `DXGI_ERROR_DEVICE_REMOVED` - device was removed, either physical removal or due to invalid API usage
* `DXGI_ERROR_DEVICE_HUNG` - the device was removed because it hung and wouldn't respond
* `DXGI_ERROR_DEVICE_RESET` - device was reset, e.g by a driver update
* `DXGI_ERROR_DRIVER_INTERNAL_ERROR` - a driver error caused device loss. Contact your IHV and then cry furiously

## COM pointer types

* ATL `CComPtr` - this type is old and nigh-on deprecated so honestly... ignore it

* WRL `ComPtr` - the standard COM pointer type you see in most samples and tutorials. Get it from DirectXTK12 or `wrl/client.h`
* WinRt `com_ptr` - as far as I know, the ""officially"" recommended one, but basically interchangeable with the other 2 in terms of quality
* WIL `com_ptr_t`

These 3 types all have one primary role, which is to manage `AddRef`/`Release` for you, so they `Release` at the end of their lifetime, and `AddRef` when copied, etc

Some note-worthy points about these types:

* WinRt `com_ptr` does not overload `&` to release the underlying address, so `IID_PPV_ARGS` doesn't work, so it sucks.
* `com_ptr_t` and `ComPtr` both overload `&` (equivalent to `ReleaseAndGetAddress` for `ComPtr`, and `put` for `com_ptr_t`) so that it releases the underlying pointer (if one is present), so that `IID_PPV_ARGS` and using it as an output parameter works. **IMPORTANTLY**, do not use it as a single element array. E.g, I have seen

```cpp
ComPtr<ID3D12DescriptorHeap> _resHeap;

cmdList->SetDescriptorHeaps(1, &_resHeap); // you just released the descriptor heap before passing it, and have now caused use-after-free. Use .GetAddressOf (or addressof for com_ptr_t instead)
```

## Debugging COM leaks

COM leaks are a real, real, real pain to debug. Thankfully, DirectX has a fewer helpers that make discovering and fixing leaks a lot easier.

Your first port of call should be `ID3D12DebugDevice::ReportLiveDeviceObjects` (`QueryInterface` the debug device off of the D3D12 device). I recommend using `D3D12_RLDO_DETAIL | D3D12_RLDO_IGNORE_INTERNAL` flags for noticing leaks - you get object types and names (when named), and ignore stuff being kept alive by the D3D12 runtime, which aren't your responsibility.

`ID3DDestructionNotifier` is also a useful type. `QueryInterface` for it off of you D3D12 object, and then call `RegisterDestructionCallback` that will be called when the object is released (the ref count equals 0). You can then log this, set a breakpoint, etc - just note you cannot safely access the object, as it is partially through the destruction process.
