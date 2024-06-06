### 引入

```js
import { add } from "grantlibs";
或;
const { add } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  两数之和（支持小数，浮点数，整数）
</div>

### 使用

```ts

add(a: number, b: number): number

```

### 参数

- a: 数值
- b: 数值

### 返回

number

### 示例

```js
add(1, 2);
// => 3
add(0.1, 0.2);
// => 0.3
add(0.1, 0.12);
// => 0.22
```
