import { getYear, getMonth, getDate, getWeekDay, getDaysOfYearMonth, getWeekOfMonth, getFullYear } from "../src";

test('getYear', () => {
  expect(getYear()).toBe(2024)
})

test('getMonth', () => {
  expect(getMonth()).toEqual('03')
})

test('getDate', () => {
  expect(getDate()).toEqual('22')
})

test('getWeekDay', () => {
  expect(getWeekDay()).toEqual('周五')
})

test('getDaysOfYearMonth', () => {
  expect(getDaysOfYearMonth()).toEqual(31)
})

test('getWeekOfMonth', () => {
  expect(getWeekOfMonth()).toEqual({ day: '周五', offset: 5 })
})

test('getFullYear', () => {
  console.log(getFullYear())
  expect(getFullYear()).toEqual('2024-03-22')
})


