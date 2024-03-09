### 引入

```js
import { isPromise } from "grantlibs";
或;
const { isPromise } = require("grantlibs");
```

### 方法列表

| 方法名         | 调用方式       | 返回值       |
| -------------- | -------------- | ------------ |
| 是否是 Promise | isPromise(val) | true / false |

### 代码示例

```js
const p1 = null;
const bool1 = isPromise(p1); // false
const p2 = undefined;
const bool2 = isPromise(p2); // false
const p = new Promise((resolve, reject) => {});
const isBool = isPromise(p); // true
```
