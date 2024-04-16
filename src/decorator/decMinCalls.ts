import { minCalls } from "../function/minCalls";
import { toDecorator } from "./toDecorator";

/**
 * @example
 * ```typescript
 * class TestClass {
 *  private count = 0;
 *  
 *  @decMinCalls(2)
 *  testMethod() {
 *   return ++this.count 
 *  }
 *  
 * }
 * const instance = new TestClass()
 * instance.testMethod() => undefined
 * instance.testMethod() => undefined
 * instance.testMethod() => 1
 * 
 * ```
 * 
 */

export function decMinCalls(n: number) {
  return toDecorator(minCalls)(n)
}