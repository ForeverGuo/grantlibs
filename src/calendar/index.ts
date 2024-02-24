import { weeks, weekItem } from "./type";
class Calendar {
  date: Date;
  constructor() {
    this.date = new Date()
  }

  /* 获取年份 */
  getYear(): number {
    return this.date.getFullYear()
  }

  /* 获取月份 */
  getMonth(): number {
    return this.date.getMonth() + 1
  }

  /* 获取日期 */
  getDate(): number {
    return this.date.getDate()
  }

  /* 获取星期几 */
  getWeekDay(year = this.getYear(), month = this.getMonth(), date = this.getDate()) :string {
    const week = new Date(`${month}/${date}/${year}`).getDay()
		return weeks[week].day
  }

  /* 获取某年某月天数 */
  getDaysOfYearMonth(year: number, month: number): number {
    const date = new Date(year, month, 0)
    return date.getDate() + 1
  }

  /* 获取某月第一天是星期几 */
  getWeekOfMonth(month: number, year = this.getYear()): weekItem {
    const week = new Date(`${month}/1/${year}`).getDay()
		return weeks[week]
  }

  /* 获取完整年月日 */
  getFullYearMonthDay(char = "-"): string {
    return`
      ${this.getYear()}${char}
      ${this.getMonth()}${char}
      ${this.getDate()}
    `
  }

}