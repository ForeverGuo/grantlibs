### 引入

```js
import { getFullYear } from "grantlibs";
或;
const { getFullYear } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  获取某年-某月-某天
</div>

### 使用

```ts

getFullYear(char: string = "-"): string

```

### 参数

1. char: 拼接符号，默认 '-'

### 返回

string: 某年-某月-某天

### 示例

```js
const year = getFullYear();
// => 2024-03-22
```
