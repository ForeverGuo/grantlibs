### 引入

```js
import { t_idCard } from "grantlibs";
或;
const { t_idCard } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  校验身份证号
</div>

### 使用

```ts

t_idCard(idCard: string): boolean

```

### 参数

idCard: string

### 返回

boolean: 是否正确

### 示例

```js
const idcard = "110101199001013590";
const res = t_idCard(idcard);
// => true
```
