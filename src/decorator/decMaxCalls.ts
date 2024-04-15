import { maxCalls } from "../function";
import { toDecorator } from "./toDecorator";

/**
 * @example
 * ```typescript
 * class TestClass {
 *  private count = 0;
 *  
 *  @decMaxCalls(2)
 *  testMethod() {
 *   return ++this.count 
 *  }
 *  
 * }
 * const instance = new TestClass()
 * instance.testMethod() => 1
 * instance.testMethod() => 2
 * instance.testMethod() => 2
 * 
 * ```
 * 
 */

export function decMaxCalls(n: number) {
  return toDecorator(maxCalls)(n)
}
