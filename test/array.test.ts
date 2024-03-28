import { sort, unique, chunk, count, difference, group, move, takeWhile, shuffle } from '../src'

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

test('count', () => {
  const array = [
    { id: 1, name: 'hony', active: true },
    { id: 2, name: 'hony', active: false },
    { id: 1, name: 'tony', active: true },
  ]
  const res = count(array, value => value.active ? 'active' : 'inactive')
  expect(res).toEqual({ 'active': 2, 'inactive': 1 })
})

test('difference', () => {
  const res = difference([3, 2, 1], [4, 2], [5])
  expect(res).toEqual([3, 1])
  const compareByFloor = (a, b) => Math.floor(a) === Math.floor(b);
  const res2 = difference([1.2, 3.1], [1.3, 2.4], compareByFloor)
  expect(res2).toEqual([3.1])
})

test('group', () => {
  const res = group([6.1, 4.2, 6.3], Math.floor)
  expect(res).toEqual({ '4': [4.2], '6': [6.1, 6.3] })
})

test('move', () => {
  const res = move([1, 2, 3, 4, 5], 0, 2)
  expect(res).toEqual([2, 3, 1, 4, 5])
})

test('takeWhile', () => {
  var users = [
    { 'user': 'barney', 'active': false },
    { 'user': 'fred', 'active': false },
    { 'user': 'pebbles', 'active': true }
  ];
  const res = takeWhile(users, user => user.active)
  expect(res).toEqual([{ 'user': 'pebbles', 'active': true }])
})

test('shuffle', () => {
  // const res = shuffle([1, 2, 3, 4])
  // console.log(res)
})

