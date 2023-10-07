# disposable

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/disposable)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/disposable/mod.ts)
[![Test](https://github.com/lambdalisue/deno-disposable/actions/workflows/test.yml/badge.svg)](https://github.com/lambdalisue/deno-disposable/actions/workflows/test.yml)

This module provides `Disposable` type with `usingResource()`,
`usingResourceSync()`, `usingAllResources()`, and `usingAllResourcesSync()`
functions to ensure a disposable resource is disposed. It is like C#'s
`IDisposable` with `using` or Python's context with `with`.

Note that
[TypeScript 5.2 add supports](https://github.com/microsoft/TypeScript/issues/52955)
for
[Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management)
which will take over the functionality provided by this library.

## Usage

Implement `Disposable` on a resource. Write code to release that resource in
`dispose()` method. Then use it with `usingResource` like:

```typescript
import {
  Disposable,
  usingResource,
} from "https://deno.land/x/disposable/mod.ts";

class Connection implements Disposable {
  dispose() {
    // Synchronously release the resource
  }
}

await usingResource(new Connection(), (conn) => {
  // The connection is alive in this block
  // Do whatever you want synchronously
});
// The connection is disposed after above block
```

You can use async function for `dispose()` or `fn` like

```typescript
import {
  Disposable,
  usingResource,
} from "https://deno.land/x/disposable/mod.ts";

class Connection implements Disposable {
  async dispose() {
    // Asynchronously release the resource
  }
}

await usingResource(new Connection(), async (conn) => {
  // The connection is alive in this block
  // Do whatever you want asynchronously
});
// The connection is disposed after above block
```

If you are only using synchronous disposable and prefer synchronous code, use
`usingResourceSync` like:

```typescript
import {
  Disposable,
  usingResourceSync,
} from "https://deno.land/x/disposable/mod.ts";

class Connection implements Disposable {
  dispose() {
    // Synchronously release the resource
  }
}

usingResourceSync(new Connection(), (conn) => {
  // The connection is alive in this block
  // Do whatever you want
});
// The connection is disposed after above block
```

If you would like to dispose multiple disposables, use `usingAllResources` like:

```typescript
import {
  Disposable,
  usingAllResources,
} from "https://deno.land/x/disposable/mod.ts";

class Connection1 implements Disposable {
  async dispose() {
    // Asynchronously release the resource
  }
}

class Connection2 implements Disposable {
  dispose() {
    // Synchronously release the resource
  }
}

await usingAllResources(
  [new Connection1(), new Connection2()],
  async (conn1, conn2) => {
    // The connections are alive in this block
    // Do whatever you want asynchronously
  },
);
// The connections are disposed after above block
```

Or use `usingAllResourcesSync` for synchronous disposables.

## License

The code follows MIT license written in [LICENSE](./LICENSE). Contributors need
to agree that any modifications sent in this repository follow the license.
