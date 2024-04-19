### 引入

```js
import { isPromise } from "grantlibs";
或;
const { isPromise } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  isPromise 检查参数是否是Promise
</div>

### 使用

```ts

isPromise(val): boolean

```

### 参数

- value: unknown

### 返回

boolean: true or false

### 示例

```js
const p1 = null;
const bool1 = isPromise(p1);
// => false
const p2 = undefined;
const bool2 = isPromise(p2);
// => false
const p = new Promise((resolve, reject) => {});
const isBool = isPromise(p);
// => true
```
