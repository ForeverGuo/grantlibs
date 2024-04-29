### 引入

```js
import { isCard } from "grantlibs";
或;
const { isCard } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  isCard 校验身份证号是否有效
</div>

### 使用

```ts

isCard(card: string): boolean

```

### 参数

- card: string

### 返回

boolean: true or false

### 示例

```js
const bool = isCard("110101200007282404");
// => true
```
