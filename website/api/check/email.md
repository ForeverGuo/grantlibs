### 引入

```js
import { isEmail } from "grantlibs";
或;
const { isEmail } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  校验邮箱
</div>

### 使用

```ts

isEmail(email: string): boolean

```

### 参数

email: string

### 返回

boolean: 是否正确

### 示例

```js
const email = "810153274@qq.com";
const res = isEmail(email);
// => true
```
