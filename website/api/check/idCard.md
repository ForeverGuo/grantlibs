### 引入

```js
import { isCard } from "grantlibs";
或;
const { isCard } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  校验身份证号
</div>

### 使用

```ts

isCard(idCard: string): boolean

```

### 参数

idCard: string

### 返回

boolean: 是否正确

### 示例

```js
const idcard = "110101199001013590";
const res = isCard(idcard);
// => true
```
