# disposable

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/disposable)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/disposable/mod.ts)
[![Test](https://github.com/lambdalisue/deno-disposable/workflows/Test/badge.svg)](https://github.com/lambdalisue/deno-disposable/actions?query=workflow%3ATest)

This module provides `Disposable` type with `using()` and `usingSync()`
functions to ensure a disposable resource is disposed. It is like C#'s
`IDisposable` with `using` or Python's context with `with`.

## Usage

Implement `Disposable` on a resource. Write code to release that resource in
`dispose()` method. Then use it with `using` like:

```typescript
class Connection implements Disposable {
  dispose() {
    // Synchronously release the resource
  }
}

await using(new Connection(), (conn) => {
  // The connection is alive in this block
  // Do whatever you want synchronously
});
// The connection is disposed after above block
```

You can use async function for `dispose()` or `fn` like

```typescript
class Connection implements Disposable {
  async dispose() {
    // Asynchronously release the resource
  }
}

await using(new Connection(), async (conn) => {
  // The connection is alive in this block
  // Do whatever you want asynchronously
});
// The connection is disposed after above block
```

If you are only using synchronous disposable and prefer synchronous code, use
`usingSync` like:

```typescript
class Connection implements Disposable {
  dispose() {
    // Synchronously release the resource
  }
}

usingSync(new Connection(), (conn) => {
  // The connection is alive in this block
  // Do whatever you want
});
// The connection is disposed after above block
```

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
