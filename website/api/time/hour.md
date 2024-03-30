### 引入

```js
import { getHour } from "grantlibs";
或;
const { getHour } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  获取当前小时
</div>

### 使用

```ts

getHour(): string

```

### 参数

无

### 返回

string: 小时

### 示例

```js
const time = getHour();
// => 22
```
