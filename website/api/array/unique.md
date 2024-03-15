### 引入

```js
import { unique } from "grantlibs";
或;
const { unique } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  对数值数组，对象数组，进行特定的条件去重，保证有效且唯一。
  返回新的数组。
</div>

### 使用

```ts

  unique<T>( array: readonly T[], fn?: (a: Temp, b: T) => boolean ): T[]

```

### 参数

1. array(Array): 需要处理的数组
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
