### 引入

```js
import { isDef } from "grantlibs";
或;
const { isDef } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  isDef 检查参数是否被定义
</div>

### 使用

```ts

isDef(val): boolean

```

### 参数

- value: unknown

### 返回

boolean: true or false

### 示例

```js
const u1 = null;
const bool1 = isDef(u1);
// => false
const u2 = undefined;
const bool2 = isDef(u2);
// => false
const val = "hello";
const isBool = isDef(val);
// => true
```
