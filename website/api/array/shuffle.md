### 引入

```js
import { shuffle } from "grantlibs";
或;
const { shuffle } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  对数组内位置重新洗牌。
</div>

### 使用

```ts

shuffle<T>( array: readonly T[]): T[]

```

### 参数

1. array(Array): 检查的数组

### 返回

（Array）：返回一个新数组

### 示例

```js
shuffle([1, 2, 3, 4]);
// => [4, 1, 3, 2]
```
