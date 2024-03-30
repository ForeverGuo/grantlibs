### 引入

```js
import { getMinute } from "grantlibs";
或;
const { getMinute } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  获取当前分钟
</div>

### 使用

```ts

getMinute(): string

```

### 参数

无

### 返回

string: 分钟

### 示例

```js
const minute = getMinute();
// => 22
```
