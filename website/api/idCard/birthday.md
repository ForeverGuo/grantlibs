### 引入

```js
import { getCardBirth } from "grantlibs";
或;
const { getCardBirth } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  根据身份证获取出生日期
</div>

### 使用

```ts

getCardBirth(idCard: string): string | NULL

```

### 参数

- idCard: 身份证号

### 返回

出生日期 / NULL

### 示例

```js
const card = "110101199001013590";
const date = getCardBirth(card);
// => '1990-01-01'
```
