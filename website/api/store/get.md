### 引入

```js
import { storeGet } from "grantlibs";
或;
const { storeGet } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  获取键值
</div>

### 使用

```ts

storeGet(key: any): any

```

### 参数

- key: any

### 返回

对应键值

### 示例

```js
storeGet("name");
// => 'store'
```
