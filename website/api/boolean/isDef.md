### 引入

```js
import { isDef } from "grantlibs";
或;
const { isDef } = require("grantlibs");
```

### 方法列表

| 方法名         | 调用方式   | 返回值       |
| -------------- | ---------- | ------------ |
| 是否被定义有值 | isDef(val) | true / false |

### 代码示例

```js
const u1 = null;
const bool1 = isDef(u1); // false
const u2 = undefined;
const bool2 = isDef(u2); // false
const val = "hello";
const isBool = isDef(val); // true
```
