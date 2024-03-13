import { sort } from '../src'

test("sort", () => {
  const array = sort([1, 3, 2], { order: 'asc' })
  expect(array).toEqual([1, 2, 3])
})

test("sort multiple", () => {
  const array = sort([{ a: 1, b: 2 }, { a: 1, b: 4 }, { a: 2, b: 1 }], { order: 'des', by: item => item.b }, { order: 'asc', by: item => item.a })
  expect(array).toEqual([{ a: 1, b: 4 }, { a: 1, b: 2 }, { a: 2, b: 1 }])
})
