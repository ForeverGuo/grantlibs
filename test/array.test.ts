import { sort, unique, chunk } from '../src'

test("sort", () => {
  const array = sort([1, 3, 2], { order: 'asc' })
  expect(array).toEqual([1, 2, 3])
})

test("sort multiple", () => {
  const array = sort([{ a: 1, b: 2 }, { a: 1, b: 4 }, { a: 2, b: 1 }], { order: 'des', by: item => item.b }, { order: 'asc', by: item => item.a })
  expect(array).toEqual([{ a: 1, b: 4 }, { a: 1, b: 2 }, { a: 2, b: 1 }])
})

test('uniqueArr2', () => {
  const arr = [1, 2, 2, 3]
  const uniqueArr = unique(arr)
  expect(uniqueArr).toEqual([1, 2, 3])
})

test('uniqueArr2', () => {
  const arr = [
    { id: 1, name: 'tiny' },
    { id: 1, name: 'john' },
    { id: 3, name: 'tiny' },
  ]
  const uniqueArr = unique(arr, (a, b) => a.id === b.id)
  expect(uniqueArr).toEqual([{ id: 1, name: 'tiny' }, { id: 3, name: 'tiny' }])
})

test('chunk', () => {
  const arr = chunk(['a', 'b', 'c', 'd'], 2)
  expect(arr).toEqual([['a', 'b'], ['c', 'd']])
})
