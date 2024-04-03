import { idCardBirth, idCardSex } from "../src/index";

test("获取年月日", () => {
  const card = '110101199001013590'
  const date = idCardBirth(card)
  expect(date).toBe('1990-01-01')
});

test("获取性别", () => {
  const card = '110101199001013590'
  const sex = idCardSex(card)
  expect(sex).toBe('男性')
});