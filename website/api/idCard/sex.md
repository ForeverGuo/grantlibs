### 引入

```js
import { getCardSex } from "grantlibs";
或;
const { getCardSex } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  根据身份证获取性别
</div>

### 使用

```ts

getCardSex(idCard: string): string

```

### 参数

- idCard: 身份证号

### 返回

男性 / 女性

### 示例

```js
const card = "110101199001013590";
const sex = getCardSex(card);
// => '男性'
```
