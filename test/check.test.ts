import { test as check } from "../src/index";

test("测试手机号", () => {
  const mobile = 17704052506
  const res = check.mobile(`${mobile}`)
  expect(res).toBeTruthy()
});

test("测试邮箱正确", () => {
  const email = '810153274@qq.com'
  const res = check.email(email)
  expect(res).toBeTruthy()
});

test("测试邮箱错误", () => {
  const email = '8101274'
  const res = check.email(email)
  expect(res).toBeFalsy()
});

test("测试身份证号", () => {
  const idcard = '110101199001013590'
  const res = check.idCard(idcard)
  expect(res).toBeTruthy()
});

test("测试车牌号", () => {
  const plate = '京JB1295'
  const res = check.plate(plate)
  expect(res).toBeTruthy()
});

