### 引入

```js
import { chunk } from "grantlibs";
或;
const { chunk } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块
</div>

### 使用

```ts

chunk<T>( array: readonly T[], size: number ): T[][]

```

### 参数

1. array(Array): 检查的数组
2. [size = 1]number : 每个数组区块的长度

### 返回

(Array): 返回一个包含拆分区块的新数组（注：相当于一个二维数组）。

### 示例

```js
chunk(["a", "b", "c", "d"], 2);
// => [['a', 'b'], ['c', 'd']]

chunk(["a", "b", "c", "d"], 3);
// => [['a', 'b', 'c'], ['d']]
```
