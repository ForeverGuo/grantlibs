import { sum, average, round } from '../src'

test('sum', () => {
  const res = sum([1, 2, 3, 4, 5])
  expect(res).toBe(15)
})

test('average', () => {
  const ave = average([1, 2, 3, 4, 5])
  expect(ave).toBe(3)
})

test('round', () => {
  const r = round(123.12, 1)
  expect(r).toBe(123.1)
})
