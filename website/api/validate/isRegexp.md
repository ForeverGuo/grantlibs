### 引入

```js
import { isRegExp } from "grantlibs";
或;
const { isRegExp } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  isRegExp 检查参数是否是RegExp
</div>

### 使用

```ts

isRegExp(val): boolean

```

### 参数

- value: unknown

### 返回

boolean: true or false

### 代码示例

```js
const reg = /[0-9a-z]/;
console.log("是否是正则reg：", isRegExp(reg));
// => true
console.log("是否是正则reg：", isRegExp(/[0-9a-zA-Z]+/g));
// => true
console.log("是否是正则reg：", isRegExp("[0-9a-zA-Z]+"));
// => 输出 false, 必须是完整正则带 // 的
console.log("是否是正则reg：", isRegExp(""));
// => false
console.log("是否是正则reg：", isRegExp(1111));
// => false
```
