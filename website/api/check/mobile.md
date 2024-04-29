### 引入

```js
import { isMobile } from "grantlibs";
或;
const { isMobile } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  校验手机号
</div>

### 使用

```ts

isMobile(mobile: string): boolean

```

### 参数

mobile: string

### 返回

boolean: 是否正确

### 示例

```js
const mobile = 17704052506;
const res = isMobile(`${mobile}`);
// => true
```
