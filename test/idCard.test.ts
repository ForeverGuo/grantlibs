import { getCardBirth, getCardSex, getCardAge } from "../src/index";

test("获取年月日", () => {
  const card = '110101199001013590'
  const date = getCardBirth(card)
  expect(date).toBe('1990-01-01')
});

test("获取性别", () => {
  const card = '110101199001013590'
  const sex = getCardSex(card)
  expect(sex).toBe('男性')
});

test("获取年龄", () => {
  const card = '110101199001013590'
  const age = getCardAge(card)
  expect(age).toBe(34)
})