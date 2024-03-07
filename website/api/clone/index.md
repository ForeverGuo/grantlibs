### 引入

```js
import { calendar } from "grantlibs";
或;
const { calendar } = require("grantlibs");
```

### 方法列表

| 方法名   | 调用方式        |
| -------- | --------------- |
| 深度拷贝 | clone.deep()    |
| 浅拷贝   | clone.shallow() |

### 代码示例

```js
const obj = {
  a: 1,
  b: "hello",
  c: [1, 2, 3],
  d: { e: "nested", f: [4, 5, 6] },
};
/* 深度拷贝 */
const deepObj = clone.deep(obj);
/* 深度拷贝 */
const shallowObj = clone.shallow(obj);
```
