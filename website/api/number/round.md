### 引入

```js
import { round } from "grantlibs";
或;
const { round } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  将数字舍入到给定的精度
</div>

### 使用

```ts

round(number: number, precision = 2): number

```

### 参数

- number: 数值
- precision: 默认精度是 2

### 返回

number

### 示例

```js
round(1.23456, 2);
// => 1.23
round(1.235, 1);
// => 1.2
round(1234.56);
// => 1234.56
```
