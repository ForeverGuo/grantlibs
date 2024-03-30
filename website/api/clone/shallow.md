### 引入

```js
import { shallow } from "grantlibs";
或;
const { shallow } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  浅克隆，引用地址是保持一致的
</div>

### 使用

```ts

shallow<T>(object: T): T

```

### 参数

object: T

### 返回

object: T

### 示例

```js
const obj = {
  a: 1,
  b: "hello",
  c: [1, 2, 3],
  d: { e: "nested", f: [4, 5, 6] },
};
const res = shallow(obj);
// => {
//   a: 1,
//   b: 'hello',
//   c: [1, 2, 3],
//   d: { e: 'nested', f: [4, 5, 6] }
// }
```
