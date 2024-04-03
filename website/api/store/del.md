### 引入

```js
import { storeDel } from "grantlibs";
或;
const { storeDel } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  删除键
</div>

### 使用

```ts

storeDel(key: any): boolean

```

### 参数

- key: any

### 返回

布尔值：成功 true; 失败 false

### 示例

```js
storeDel("name");
// => true
```
