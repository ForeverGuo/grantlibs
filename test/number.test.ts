import { sum, average, round, add } from '../src'

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

test('add', () => {
  const r = add(0.1, 0.2)
  const s = add(0.1, 0.12)
  const t = add(1.1, 22.3)
  console.log(r, s, t)
  expect(r).toBe(0.3)
})

