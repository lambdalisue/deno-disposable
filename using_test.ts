import {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.203.0/testing/asserts.ts";
import { Disposable } from "./types.ts";
import {
  usingAllResources,
  usingAllResourcesSync,
  usingResource,
  usingResourceSync,
} from "./using.ts";

class SynchronousDisposable implements Disposable {
  #callback: () => void;

  constructor(callback: () => void) {
    this.#callback = callback;
  }

  dispose(): void {
    this.#callback();
  }
}

class AsynchronousDisposable implements Disposable {
  #callback: () => void;

  constructor(callback: () => void) {
    this.#callback = callback;
  }

  async dispose(): Promise<void> {
    await Promise.resolve();
    this.#callback();
  }
}

Deno.test("usingResource ensure asynchronous disposable is disposed", async () => {
  const calls = [];

  calls.push("enter");
  const result = await usingResource(
    new AsynchronousDisposable(() => calls.push("dispose")),
    (r) => {
      assert(r instanceof AsynchronousDisposable);
      calls.push("fn");
      return "Hello world!";
    },
  );
  calls.push("leave");

  assertEquals(result, "Hello world!");
  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "leave",
  ]);
});

Deno.test("usingResource ensure asynchronous disposable is disposed even on error", async () => {
  const calls = [];

  calls.push("enter");
  await assertRejects(async () => {
    await usingResource(
      new AsynchronousDisposable(() => calls.push("dispose")),
      (r) => {
        assert(r instanceof AsynchronousDisposable);
        calls.push("fn");
        throw new Error("Error");
      },
    );
  });
  calls.push("leave");

  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "leave",
  ]);
});

Deno.test("usingResource ensure synchronous disposable is disposed", async () => {
  const calls = [];

  calls.push("enter");
  const result = await usingResource(
    new SynchronousDisposable(() => calls.push("dispose")),
    (r) => {
      assert(r instanceof SynchronousDisposable);
      calls.push("fn");
      return "Hello world!";
    },
  );
  calls.push("leave");

  assertEquals(result, "Hello world!");
  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "leave",
  ]);
});

Deno.test("usingResource ensure synchronous disposable is disposed even on error", async () => {
  const calls = [];

  calls.push("enter");
  await assertRejects(async () => {
    await usingResource(
      new SynchronousDisposable(() => calls.push("dispose")),
      (r) => {
        assert(r instanceof SynchronousDisposable);
        calls.push("fn");
        throw new Error("Error");
      },
    );
  });
  calls.push("leave");

  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "leave",
  ]);
});

Deno.test("usingResourceSync ensure synchronous disposable is disposed", () => {
  const calls = [];

  calls.push("enter");
  const result = usingResourceSync(
    new SynchronousDisposable(() => calls.push("dispose")),
    (r) => {
      assert(r instanceof SynchronousDisposable);
      calls.push("fn");
      return "Hello world!";
    },
  );
  calls.push("leave");

  assertEquals(result, "Hello world!");
  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "leave",
  ]);
});

Deno.test("usingResourceSync ensure synchronous disposable is disposed even on error", () => {
  const calls = [];

  calls.push("enter");
  assertThrows(() => {
    usingResourceSync(
      new SynchronousDisposable(() => calls.push("dispose")),
      (r) => {
        assert(r instanceof SynchronousDisposable);
        calls.push("fn");
        throw new Error("Error");
      },
    );
  });
  calls.push("leave");

  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "leave",
  ]);
});

Deno.test("usingAllResources ensure disposables are disposed", async () => {
  const calls = [];

  calls.push("enter");
  const result = await usingAllResources(
    [
      new AsynchronousDisposable(() => calls.push("dispose")),
      new SynchronousDisposable(() => calls.push("dispose")),
      new AsynchronousDisposable(() => calls.push("dispose")),
    ],
    (r1, r2, r3) => {
      assert(r1 instanceof AsynchronousDisposable);
      assert(r2 instanceof SynchronousDisposable);
      assert(r3 instanceof AsynchronousDisposable);
      calls.push("fn");
      return "Hello world!";
    },
  );
  calls.push("leave");

  assertEquals(result, "Hello world!");
  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "dispose",
    "dispose",
    "leave",
  ]);
});

Deno.test("usingAllResources ensure disposables are disposed even on error", async () => {
  const calls = [];

  calls.push("enter");
  await assertRejects(async () => {
    await usingAllResources(
      [
        new AsynchronousDisposable(() => calls.push("dispose")),
        new SynchronousDisposable(() => calls.push("dispose")),
        new AsynchronousDisposable(() => calls.push("dispose")),
      ],
      (r1, r2, r3) => {
        assert(r1 instanceof AsynchronousDisposable);
        assert(r2 instanceof SynchronousDisposable);
        assert(r3 instanceof AsynchronousDisposable);
        calls.push("fn");
        throw new Error("Error");
      },
    );
  });
  calls.push("leave");

  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "dispose",
    "dispose",
    "leave",
  ]);
});

Deno.test("usingAllResourcesSync ensure synchronous disposables are disposed", () => {
  const calls = [];

  calls.push("enter");
  const result = usingAllResourcesSync(
    [
      new SynchronousDisposable(() => calls.push("dispose")),
      new SynchronousDisposable(() => calls.push("dispose")),
      new SynchronousDisposable(() => calls.push("dispose")),
    ],
    (r1, r2, r3) => {
      assert(r1 instanceof SynchronousDisposable);
      assert(r2 instanceof SynchronousDisposable);
      assert(r3 instanceof SynchronousDisposable);
      calls.push("fn");
      return "Hello world!";
    },
  );
  calls.push("leave");

  assertEquals(result, "Hello world!");
  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "dispose",
    "dispose",
    "leave",
  ]);
});

Deno.test("usingAllResourcesSync ensure synchronous disposables are disposed even on error", () => {
  const calls = [];

  calls.push("enter");
  assertThrows(() => {
    usingAllResourcesSync(
      [
        new SynchronousDisposable(() => calls.push("dispose")),
        new SynchronousDisposable(() => calls.push("dispose")),
        new SynchronousDisposable(() => calls.push("dispose")),
      ],
      (r1, r2, r3) => {
        assert(r1 instanceof SynchronousDisposable);
        assert(r2 instanceof SynchronousDisposable);
        assert(r3 instanceof SynchronousDisposable);
        calls.push("fn");
        throw new Error("Error");
      },
    );
  });
  calls.push("leave");

  assertEquals(calls, [
    "enter",
    "fn",
    "dispose",
    "dispose",
    "dispose",
    "leave",
  ]);
});
