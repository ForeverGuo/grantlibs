### 简介

- 主要产出业务场景的功能函数，以及遇到的利于快速使用开发的钩子·

### START

```shell

  pnpm install grantguo-libs -D 或 yarn add grantguo-libs -D

  // es
  import { calendar } from 'grantguo-libs'
  const year = calendar.getYear()

  // cjs
  const { calendar } = require('grantguo-libs')
  const year = calendar.getYear()

```

### Calendar 使用
｜方法  ｜调用方式 ｜
｜---- ｜--------｜
｜获取年份｜getYear｜
｜获取月份｜getMonth｜

```js
  /* 获取年份 */
  const year = calendar.getYear()

  /* 获取月份 */
  const month = calendar.getMonth()

  /* 获取日期 */
  const date = calendar.getDate()

  /* 获取某年某月某日是星期几, 默认输出当日 */
  const week = calendar.getWeekDay(year:number, month:number, date:number)

  /* 获取某年某月天数, 默认输出当月天数 */
  const days = calendar.getDaysOfYearMonth(year: number, month: number)

  /* 
    获取某月第一天是星期几, 默认输出当月第一天
    场景说明：
      针对每月天数及对应星期展示, 可输出个性化
  */
  const firstDay = calendar.getWeekOfMonth(year: number, month: number)

  /* 获取完整年月日, 默认以 - 拼接 */
  const yearMonthDay = calendar.getFullYearMonthDay(char:string = '-')
```

