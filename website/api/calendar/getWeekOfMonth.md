### 引入

```js
import { getWeekOfMonth } from "grantlibs";
或;
const { getWeekOfMonth } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  获取某年某月天数第一天是星期几
</div>

### 使用

```ts

getWeekOfMonth(year?:number, month?:number): {day: string, offset: number}

```

### 参数

1. year: 某年
2. month: 某月

### 返回

day: 星期几
offset: 偏移量

### 示例

```js
const days = getWeekOfMonth();
// => { day: '周五', offset: 5 }
```
