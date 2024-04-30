import { flatKeys } from '../src'

test('flatkeys', () => {
  const obj = { a: { b: 2, c: [{ d: 3 }, { d: 4 }] } };
  const res = flatKeys(obj)
  expect(res).toEqual({ 'a.b': 2, 'a.c[0].d': 3, 'a.c[1].d': 4 })
})
