### 简介

- 主要产出业务场景的功能函数，以及遇到的利于快速使用开发的钩子·

### START

```shell

  pnpm install grantguo-libs -D 或 yarn add grantguo-libs -D

  // es
  import { calendar, store } from 'grantguo-libs'
  const year = calendar.getYear()

  // cjs
  const { calendar, store } = require('grantguo-libs')
  const year = calendar.getYear()

```

### Calendar 使用

|  方法名   | 调用方式  |
|  ----  | ----  |
| 获取年份  | calendar.getYear() |
| 获取月份  | calendar.getMonth() |
| 获取日期  | calendar.getDate() |
| 获取某年某月某日是星期几  | calendar.getWeekDay() |
| 获取某年某月天数  | calendar.getDaysOfYearMonth() |
| 获取某月第一天是星期几  | calendar.getWeekOfMonth() |
| 获取完整年月日，默认以 - 拼接  | calendar.getFullYearMonthDay() |  

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

### store 缓存的使用 (内存缓存，刷新后缓存失效)

|  方法名   | 调用方式  |
|  ----  | ----  |
| 设置  | store.set() |
| 获取  | store.get() |
| 检查是否有设置  | store.has() |
| 删除缓存  | store.delete() |
| 缓存的长度  | store.size() |  

```js
  /* 设置缓存 键名为任意值 */
  store.set("name", 'store')

  /* 获取缓存 */
  const val = store.get("name")
 
  /* 检查是否有设置 */
  const boolean = store.has('name')  // true
 
  /* 删除缓存 */
  const boolean = store.delete('name')  // true

  /* 缓存的长度 */
  const size = store.size()

```

### clone 的使用

|  方法名   | 调用方式  |
|  ----  | ----  |
| 深度拷贝  | close.deep() |
| 浅拷贝  | close.shallow() |  

```js
  const obj = {
    a: 1,
    b: 'hello',
    c: [ 1, 2, 3 ],
    d: { e: 'nested', f: [ 4, 5, 6 ] }
  }
  /* 深度拷贝 */
  const deepObj = clone.deep(obj)
  /* 深度拷贝 */
  const shallowObj = clone.shallow(obj)
```

### test 的使用

|  方法名   | 调用方式  |
|  ----  | ----  |
| 校验手机号  | test.mobile() |
| 校验邮箱  | test.email() | 
| 校验身份证  | test.idCard() | 
| 校验车牌号  | test.plate() |  

```js
  /* 校验手机号 */
  const mobile = 17704052506
  const res = test.mobile(`${mobile}`)
  /* 校验邮箱 */
  const email = '810153274@qq.com'
  const res = test.email(email)
  /* 校验身份证 */
  const idcard = '110101199001013590'
  const res = test.idCard(idcard)
  /* 校验车牌号 */
  const plate = '京JB1295'
  const res = test.plate(plate)
```

### idCard 的使用

|  方法名   | 调用方式  |
|  ----  | ----  |
| 获取出生年月  | idCard.birthday() |
| 获取性别  | idCard.sex() | 

```js
  /* 获取出生年月 */
  const card = '110101199001013590'
  const date = idCard.birthday(card)

  /* 获取性别 */
  const card = '110101199001013590'
  const sex = idCard.sex(card)
```
