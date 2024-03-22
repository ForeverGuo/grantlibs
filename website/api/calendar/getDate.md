### 引入

```js
import { getDate } from "grantlibs";
或;
const { getDate } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  获取当前月份
</div>

### 使用

```ts

getDate(): string

```

### 参数

no params

### 返回

number: 当前几号。

### 示例

```js
const day = getDate();
// => '22'
```
