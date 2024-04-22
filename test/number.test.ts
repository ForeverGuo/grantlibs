import { sum, average } from '../src'

test('sum', () => {
  const res = sum([1, 2, 3, 4, 5])
  expect(res).toBe(15)
})

test('average', () => {
  const ave = average([1, 2, 3, 4, 5])
  expect(ave).toBe(3)
})
