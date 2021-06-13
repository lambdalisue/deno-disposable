type Void = void | Promise<void>;

/**
 * Disposable has 'dispose()' method to dispose the resource
 */
export type Disposable<R extends Void = Void> = {
  /**
   * Dispose the resource
   */
  dispose: () => R;
};
