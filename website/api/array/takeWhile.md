### 引入

```js
import { takeWhile } from "grantlibs";
或;
const { takeWhile } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  从数组中提取元素，返回一个新的数组。
</div>

### 使用

```ts

takeWhile<T>( array: readonly T[], fn: T => boolean ): T[]

```

### 参数

1. array(Array): 检查的数组
2. fn : 提取条件

### 返回

（Array）：返回一个根据条件提取的新数组

### 示例

```js
var users = [
  { user: "barney", active: false },
  { user: "fred", active: false },
  { user: "pebbles", active: true },
];
takeWhile(users, (user) => user.active);
// => Objects for ['pebbles']
```
