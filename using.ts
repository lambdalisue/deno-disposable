import { Disposable } from "./types.ts";

/**
 * Ensure a synchronous or asynchronous disposable resource is disposed
 *
 * It invokes 'dispose()' method of the resource prior to leave the inner function.
 * It suppors both synchronous and asynchronous disposable.
 */
export async function usingResource<T extends Disposable, R = unknown>(
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
 * Ensure synchronous and/or asynchronous disposable resources are disposed
 *
 * It invokes 'dispose()' method of resources prior to leave the inner function.
 * It suppors both synchronous and asynchronous disposables.
 */
export async function usingAllResources<
  T extends readonly Disposable[],
  R = unknown,
>(
  resources: [...T],
  fn: (...resources: [...T]) => R | Promise<R>,
): Promise<R> {
  try {
    return await fn(...resources);
  } finally {
    await Promise.all(resources.map((r) => r.dispose()));
  }
}

/**
 * Ensure a synchronous disposable resource is disposed
 *
 * It invokes 'dispose()' method of the resource prior to leave the inner function.
 * It suppors only synchronous disposable.
 */
export function usingResourceSync<T extends Disposable<void>, R = unknown>(
  resource: T,
  fn: (resource: T) => R,
): R {
  try {
    return fn(resource);
  } finally {
    resource.dispose();
  }
}

/**
 * Ensure synchronous disposable resources are disposed
 *
 * It invokes 'dispose()' method of resources prior to leave the inner function.
 * It suppors only synchronous disposables.
 */
export function usingAllResourcesSync<
  T extends Disposable<void>[],
  R = unknown,
>(
  resources: [...T],
  fn: (...resources: [...T]) => R,
): R {
  try {
    return fn(...resources);
  } finally {
    resources.forEach((r) => r.dispose());
  }
}

/**
 * @deprecated Use `usingResource` instead (See https://github.com/denoland/deno/issues/20271 for reasons)
 */
export function using<T extends Disposable, R = unknown>(
  resource: T,
  fn: (resource: T) => R | Promise<R>,
): Promise<R> {
  return usingResource(resource, fn);
}

/**
 * @deprecated Use `usingAllResources` instead
 */
export function usingAll<
  T extends readonly Disposable[],
  R = unknown,
>(
  resources: [...T],
  fn: (...resources: [...T]) => R | Promise<R>,
): Promise<R> {
  return usingAllResources(resources, fn);
}

/**
 * @deprecated Use `usingResourceSync` instead
 */
export function usingSync<T extends Disposable<void>, R = unknown>(
  resource: T,
  fn: (resource: T) => R,
): R {
  return usingResourceSync(resource, fn);
}

/**
 * @deprecated Use `usingAllResourcesSync` instead
 */
export function usingAllSync<
  T extends Disposable<void>[],
  R = unknown,
>(
  resources: [...T],
  fn: (...resources: [...T]) => R,
): R {
  return usingAllResourcesSync(resources, fn);
}
