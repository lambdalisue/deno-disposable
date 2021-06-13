import {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
} from "./deps_test.ts";
import { Disposable } from "./types.ts";
import { using, usingSync } from "./using.ts";

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

Deno.test("using ensure asynchronous disposable is disposed", async () => {
  const calls = [];

  calls.push("enter");
  const result = await using(
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

Deno.test("using ensure asynchronous disposable is disposed even on error", async () => {
  const calls = [];

  calls.push("enter");
  await assertThrowsAsync(async () => {
    await using(
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

Deno.test("using ensure synchronous disposable is disposed", async () => {
  const calls = [];

  calls.push("enter");
  const result = await using(
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

Deno.test("using ensure synchronous disposable is disposed even on error", async () => {
  const calls = [];

  calls.push("enter");
  await assertThrowsAsync(async () => {
    await using(
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

Deno.test("usingSync ensure synchronous disposable is disposed", () => {
  const calls = [];

  calls.push("enter");
  const result = usingSync(
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

Deno.test("usingSync ensure synchronous disposable is disposed even on error", () => {
  const calls = [];

  calls.push("enter");
  assertThrows(() => {
    usingSync(
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
