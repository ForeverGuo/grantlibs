import { weeks, weekItem } from "./type";

const date = new Date()


/* 获取年份 */
export function getYear(): number {
  return date.getFullYear()
}

/* 获取月份 */
export function getMonth(): string {
  return (date.getMonth() + 1).toString().padStart(2, '0')
}

/* 获取日期 */
export function getDate(): string {
  return date.getDate().toString().padStart(2, '0')
}

function getNumMonth(): number {
  return date.getMonth() + 1
}

/* 获取星期几 */
export function getWeekDay(year: number = getYear(), month: number = getNumMonth(), date: string = getDate()): string {
  const week = new Date(`${month}/${date}/${year}`).getDay()
  return weeks[week].day
}

/* 获取某年某月天数 */
export function getDaysOfYearMonth(year: number = getYear(), month: number = getNumMonth()): number {
  const date = new Date(year, month, 0)
  return date.getDate()
}

/* 获取某月第一天是星期几 */
export function getWeekOfMonth(year: number = getYear(), month: number = getNumMonth()): weekItem {
  const week = new Date(`${month}/1/${year}`).getDay()
  return weeks[week]
}

/* 获取完整年月日 */
export function getFullYear(char: string = "-"): string {
  return `${getYear()}${char}${getMonth()}${char}${getDate()}`
}

