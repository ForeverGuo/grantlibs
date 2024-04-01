import { debounce, times } from "../src/index";

test("debounce", () => {
  debounce(() => {
    console.log('hello world')
  }, 1000, true)
})


test("times", () => {
  const res = times((index) => `run ${index}`, 3)
  expect(res).toEqual(['run 0', 'run 1', 'run 2'])
})

