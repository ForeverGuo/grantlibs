/**
 * Creates a function that invokes the given function as long as it's called `<= n` times.
 * @description 最大执行次数
 * @author grantguo
 * @date 2024-04-15 19:43:05
 * 
 * @example
 * let count = 0;
 * const addCount = () => ++count;
 *
 * // Allow addCount to be invoked twice.
 * const limitAddCount = maxCalls(addCount, 2)
 *
 * limitAddCount() // => 1
 * limitAddCount() // => 2
 * limitAddCount() // => 2
 * 
*/

import { GenericFunction } from "../type";

export function maxCalls<TFunc extends GenericFunction<TFunc>>(func: TFunc, n: number) {
  let count = 0;
  let result: ReturnType<TFunc>;

  return function (this: unknown, ...args: Parameters<TFunc>) {
    if (count < n) {
      count += 1;
      result = func.apply(this, args)
    }
    return result
  } as TFunc

}
