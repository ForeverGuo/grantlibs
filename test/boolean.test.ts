import { isObject, isPromise, isDef } from "../src/boolean";

test('isObject', () => {
  expect(isObject(null)).toBe(false)
  expect(isObject({ a: 1 })).toBe(true)
})

test('isPromise', () => {
  expect(isPromise(null)).toBe(false)
  expect(isPromise(new Promise(() => { }))).toBe(true)
})

test('isDef', () => {
  expect(isDef(undefined)).toBe(false)
  expect(isDef("hello")).toBe(true)
})