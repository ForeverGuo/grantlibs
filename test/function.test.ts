import { debounce, times, memorize } from "../src/index";

test("debounce", () => {
  debounce(() => {
    // console.log('hello world')
  }, 1000, true)
})


test("times", () => {
  const res = times((index) => `run ${index}`, 3)
  expect(res).toEqual(['run 0', 'run 1', 'run 2'])
})

test('memorize', () => {
  function fibonacci(n: number) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  const memoizedFib = memorize(fibonacci, { ttl: 1000 })

  // console.log(memoizedFib(10))
  // console.log(memoizedFib(10))

  // console.log(memoizedFib.cache)
  // console.log(memoizedFib.cache.get('10'))

})
