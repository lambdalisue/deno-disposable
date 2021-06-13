import { Disposable } from "./types.ts";

/**
 * Ensure a synchronous or asynchronous disposable resource is disposed
 *
 * It invokes 'dispose()' method of the resource prior to leave the inner function.
 * It suppors both synchronous and asynchronous disposable.
 */
export async function using<T extends Disposable, R = unknown>(
  resource: T,
  fn: (resource: T) => R | Promise<R>,
): Promise<R> {
  try {
    return await fn(resource);
  } finally {
    await resource.dispose();
  }
}

/**
 * Ensure a synchronous disposable resource is disposed
 *
 * It invokes 'dispose()' method of the resource prior to leave the inner function.
 * It suppors only synchronous disposable.
 */
export function usingSync<T extends Disposable<void>, R = unknown>(
  resource: T,
  fn: (resource: T) => R,
): R {
  try {
    return fn(resource);
  } finally {
    resource.dispose();
  }
}
