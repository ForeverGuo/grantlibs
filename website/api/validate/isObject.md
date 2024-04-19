### 引入

```js
import { isObject } from "grantlibs";
或;
const { isObject } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  isObject 检查参数是否是对象
</div>

### 使用

```ts

isObject(val): boolean

```

### 参数

- value: unknown

### 返回

boolean: true or false


### 示例

```js
const u1 = null;
const bool1 = isObject(u1); 
// => false
const u2 = undefined;
const bool2 = isObject(u2); 
// => false
const val = { a: 1 };a
const isBool = isObject(val); 
// => true
```
