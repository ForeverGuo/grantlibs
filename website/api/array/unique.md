### 引入

```js
import { unique } from "grantlibs";
或;
const { unique } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  创建一个去重后的array数组副本。使用了SameValueZero 做等值比较。只有第一次出现的元素才会被保留。
</div>

### 使用

```ts

  unique<T>( array: readonly T[], fn?: (a: Temp, b: T) => boolean ): T[]

```

### 参数

1. array(Array): 检查的数组
2. (a, b) => boolean: 根据特殊字段的执行函数

### 返回

（Array）：返回一个根据条件去重的新数组

### 示例

```js
unique([1, 2, 2, 3]);
//  => [1, 2, 3]

// --- Sorting by multiple properties ---
const arr = [
  { id: 1, name: "tiny" },
  { id: 1, name: "john" },
  { id: 3, name: "tiny" },
];

unique(arr, isEqual);
// => [{ id: 1, name: 'tiny' }, { id: 2, name: 'tiny' }]

unique(arr, (a, b) => a.name === b.name);
// => [{ id: 1, name: 'tiny' }, { id: 1, name: 'john' },]
```
