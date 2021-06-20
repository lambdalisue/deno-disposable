# disposable

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/disposable)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/disposable/mod.ts)
[![Test](https://github.com/lambdalisue/deno-disposable/actions/workflows/test.yml/badge.svg)](https://github.com/lambdalisue/deno-disposable/actions/workflows/test.yml)

This module provides `Disposable` type with `using()`, `usingSync()`,
`usingAll()`, and `usingAllSync()` functions to ensure a disposable resource is
disposed. It is like C#'s `IDisposable` with `using` or Python's context with
`with`.

## Usage

Implement `Disposable` on a resource. Write code to release that resource in
`dispose()` method. Then use it with `using` like:

```typescript
import { Disposable, using } from "https://deno.land/x/disposable/mod.ts";

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
import { Disposable, using } from "https://deno.land/x/disposable/mod.ts";

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
import { Disposable, usingSync } from "https://deno.land/x/disposable/mod.ts";

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

If you would like to dispose multiple disposables, use `usingAll` like:

```typescript
import { Disposable, usingAll } from "https://deno.land/x/disposable/mod.ts";

class ConnectionType1 implements Disposable {
  async dispose() {
    // Asynchronously release the resource
  }
}

class ConnectionType2 implements Disposable {
  dispose() {
    // Synchronously release the resource
  }
}

await usingAll([new Connection1(), new Connection2()], async (conn1, conn2) => {
  // The connections are alive in this block
  // Do whatever you want asynchronously
});
// The connections are disposed after above block
```

Or use `usingAllSync` for synchronous disposables.

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
