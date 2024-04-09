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
 * const memoizedFib = memorize(fibonacci, { ttl: 1000 })
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
const defaultResolver = (...args: unknown[]) => JSON.stringify(args[0]);

export function memorize<
  TFunc extends GenericFunction<TFunc>,
  Cache extends Map<string, [ReturnType<TFunc>, number]>
>(
  func: TFunc,
  options: { resolver?: (...args: Parameters<TFunc>) => string, ttl?: number }
): TFunc & { cache: Cache } {
  const resolver = options.resolver ?? defaultResolver
  const ttl = options.ttl
  const cache = new Map as Cache

  const memorizedFunc = function (this: unknown, ...args: Parameters<TFunc>): ReturnType<TFunc> {
    const key = resolver(...args as unknown[]);
    if (cache.has(key)) {
      const [cacheResult, cacheTime] = cache.get(key)
      if (ttl == undefined || Date.now() - cacheTime < ttl) {
        return cacheResult
      }
    }
    const result = func.apply(this, args)
    cache.set(key, [result, Date.now()])
    return result;
  }

  memorizedFunc.cache = cache
  return memorizedFunc as TFunc & { cache: Cache };
}






