### 引入

```js
import { getTime } from "grantlibs";
或;
const { getTime } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  获取当前时分秒
</div>

### 使用

```ts

getTime(): string

```

### 参数

无

### 返回

string: 时分秒

### 示例

```js
const time = getTime();
// => 10:10:10
```
