### 引入

```js
import { sort } from "grantlibs";
或;
const { sort } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  对数值数组，对象数组，进行特定的条件排序，保证有效且唯一。
  返回新的数组。
</div>

### 使用

```ts

sort<T>( array: readonly T[], ...list: { order?: 'asc'|'des', by?: T => any }[] ): T[]

```

### 参数

1. array(Array): 需要处理的数组
2. order?: string : 升序降序，默认 asc 升序
3. by?: T => T : 执行排序的函数

### 返回

（Array）：返回一个根据条件排序的新数组

### 示例

```js
sort([1, 3, 2], { order: "asc" });
// => [1, 2, 3]

// --- Sorting by multiple properties ---
sort(
  [
    { a: 1, b: 2 },
    { a: 2, b: 4 },
  ],
  { order: "des", by: (item) => item.b }
);
// [{a: 2, b: 4}, {a: 1, b: 2}]
```
