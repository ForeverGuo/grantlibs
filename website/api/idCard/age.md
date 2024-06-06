### 引入

```js
import { getCardAge } from "grantlibs";
或;
const { getCardAge } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  根据身份证获取年龄
</div>

### 使用

```ts

getCardAge(idCard: string): number

```

### 参数

- idCard: 身份证号

### 返回

number

### 示例

```js
const card = "110101199001013590";
const age = getCardAge(card);
// => 34
```
