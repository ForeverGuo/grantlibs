import { isObject, isPromise, isDef, isEqual } from "../src/boolean";

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

test('isEqual', () => {
  expect(isEqual(1, '1')).toEqual(false)
  expect(isEqual({ a: 2, c: 3 }, { a: 2, c: 3 })).toEqual(true)
})
