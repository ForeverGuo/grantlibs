/**
 * @description Creates a function that memoizes the result of a given function.
 * @author grantguo
 * @date 2024-04-08 16:44:34
 * 
 * function fibonacci(n: number) {
 *   if (n <= 1) return n;
 *   return fibonacci(n - 1) + fibonacci(n - 2);
 * }
 *
 * const memoizedFib = memoize(fibonacci, { ttl: 1000 })
 * 
 * memoizedFib(40) // => 102334155
 * memoizedFib(40) // => 102334155 (cache hit)
 * setTimeout(() => memoizedFib(40), 1000) // => 102334155 (cache miss)
 * 
 * // Cached values are exposed as the `cache` property.
 * memoizedFib.cache.get("40") // => [value, timestamp]
 * memoizedFib.cache.set("40", [1234, Date.now()])
 * memoizedFib.cache.clear()
 * 
 * // This is the default way to create cache keys.
 * const defaultResolver = (...args: unknown[]) => JSON.stringify(args)
 * 
*/
import type { GenericFunction } from "../type/GenericFunction.js";

export function memoize<TFunc extends GenericFunction<TFunc>, Cache extends Map<string, [ReturnType<TFunc>, number]>(
  func: TFunc,
  options: { resolver?: (...args: Parameters<TFunc>) => string }
) {

}






