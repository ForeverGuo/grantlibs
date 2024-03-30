### 引入

```js
import { deep } from "grantlibs";
或;
const { deep } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  深度克隆（类型不确定即返回设置成 any）
</div>

### 使用

```ts

deep(object: any): any

```

### 参数

object: any

### 返回

object: any

### 示例

```js
const obj = {
  a: 1,
  b: "hello",
  c: [1, 2, 3],
  d: { e: "nested", f: [4, 5, 6] },
};
const res = deep(obj);
// => {
//   a: 1,
//   b: 'hello',
//   c: [1, 2, 3],
//   d: { e: 'nested', f: [4, 5, 6] }
// }
```
