import { isObject, isPromise } from "../src/boolean";

test('isObject', () => {
  expect(isObject(null)).toBe(false)
  expect(isObject({ a: 1 })).toBe(true)
})

test('isPromise', () => {
  expect(isPromise(null)).toBe(false)
  expect(isPromise(new Promise(() => { }))).toBe(true)
})
