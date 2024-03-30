import { deep, shallow } from "../src/index";

test("clone.deep 深度拷贝是否相等", () => {
  const obj = {
    a: 1,
    b: 'hello',
    c: [1, 2, 3],
    d: { e: 'nested', f: [4, 5, 6] }
  }
  const res = deep(obj)
  expect(res).toStrictEqual({
    a: 1,
    b: 'hello',
    c: [1, 2, 3],
    d: { e: 'nested', f: [4, 5, 6] }
  })
});

test("clone.shallow 浅拷贝是否相等", () => {
  const obj = {
    a: 1,
    b: 'hello',
    c: [1, 2, 3],
    d: { e: 'nested', f: [4, 5, 6] }
  }
  const res = shallow(obj)
  expect(res).toStrictEqual({
    a: 1,
    b: 'hello',
    c: [1, 2, 3],
    d: { e: 'nested', f: [4, 5, 6] }
  })
});

