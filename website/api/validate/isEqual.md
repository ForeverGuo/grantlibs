### 引入

```js
import { isEqual } from "grantlibs";
或;
const { isEqual } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  isEqual (支持基本类型，时间，日期，对象，数组，Map，Set)
</div>

### 使用

```ts

isEqual(a: unknown, b: unknown): boolean

```

### 参数

- a: 任意类型
- b: 任意类型

### 返回

boolean: true or false

### 示例

```js
const bool = isEqual(1, "1");
// => false
const res = isEqual({ a: 2, c: 3 }, { a: 2, c: 3 });
// => true
```
