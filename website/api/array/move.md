### 引入

```js
import { move } from "grantlibs";
或;
const { move } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  将数组内的元素从一个位置移动到另一个位置
</div>

### 使用

```ts

move<T>( array: T[], from: number, to: number): T[]

```

### 参数

1. array(Array): 检查的数组
2. from : 起始位置
3. to : 结束位置

### 返回

T[]，移动后的数组。

### 示例

```js
move([1, 2, 3, 4, 5], 0, 2);
// => [2, 3, 1, 4, 5]
```
