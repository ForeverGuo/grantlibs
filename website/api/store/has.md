### 引入

```js
import { storeHas } from "grantlibs";
或;
const { storeHas } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  检查是否有属性
</div>

### 使用

```ts

storeHas(key: any): boolean

```

### 参数

- key: any

### 返回

布尔值

### 示例

```js
storeHas("name");
// => true
```
