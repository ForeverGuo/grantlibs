import { isObject, isPromise, isDef, isEqual, isEmpty } from "../src/validate";

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
  const m1 = new Map()
  m1.set('a', 2)
  const m2 = new Map()
  m2.set('a', 2)
  expect(isEqual(m1, m2)).toBe(true)

  const s1 = new Set()
  s1.add('a')
  const s2 = new Set()
  s2.add('b')
  expect(isEqual(s1, s2)).toBe(false)
})

test('isEmpty', () => {
  const b1 = isEmpty({})
  expect(b1).toBe(true)
  const b2 = isEmpty([1, 2, 3])
  expect(b2).toBe(false)
})
