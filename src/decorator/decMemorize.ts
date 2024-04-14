import { memorize } from "../function";
import { toDecorator } from "./toDecorator";

/**
 * @example
 * ```typescript
 * class TestClass {
 *   @decMemoize({ ttl: 1000 })
 *   testMethod(a: number, b: number) {
 *     return a + b;
 *   }
 * }
 * const instance = new TestClass();
 * instance.testMethod(1, 2); // => 3
 * instance.testMethod(1, 2); // => 3 (cached)
 * 
 * // After 1 second:
 * instance.testMethod(1, 2); // => 3 (cache miss)
 * ```
 */

export function decMemorize(options: Parameters<typeof memorize>[1] = {}) {
  return toDecorator(memorize)(options);
}