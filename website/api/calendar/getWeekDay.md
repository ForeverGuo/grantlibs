### 引入

```js
import { getDate } from "grantlibs";
或;
const { getDate } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  获取某天是星期几
</div>

### 使用

```ts

getWeekDay(year?:number, month?:number, date?:number): string

```

### 参数

1. year: 某年
2. month: 某月
3. date: 某天

### 返回

string: 星期几。

### 示例

```js
const week = getWeekDay();
// => '周五'
```
