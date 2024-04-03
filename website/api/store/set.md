### 引入

```js
import { storeSet } from "grantlibs";
或;
const { storeSet } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  设置临时存储
</div>

### 使用

```ts

storeSet(key: any, val: any)

```

### 参数

- key: any
- val: any

### 返回

无

### 示例

```js
storeSet("name", "store");
// => 'store'
```
