### 引入

```js
import { getDaysOfYearMonth } from "grantlibs";
或;
const { getDaysOfYearMonth } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  获取某年某月天数
</div>

### 使用

```ts

getDaysOfYearMonth(year?:number, month?:number): number

```

### 参数

1. year: 某年
2. month: 某月

### 返回

number: 天数。

### 示例

```js
const days = getDaysOfYearMonth();
// => 31
```
