### 引入

```js
import { isObject } from "grantlibs";
或;
const { isObject } = require("grantlibs");
```

### 方法列表

| 方法名     | 调用方式      | 返回值       |
| ---------- | ------------- | ------------ |
| 是否是对象 | isObject(val) | true / false |

### 代码示例

```js
const u1 = null;
const bool1 = isObject(u1); // false
const u2 = undefined;
const bool2 = isObject(u2); // false
const val = { a: 1 };
const isBool = isObject(val); // true
```
