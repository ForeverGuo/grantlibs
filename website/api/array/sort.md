### 引入

```js
import { sort } from "grantlibs";
或;
const { sort } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  除了优化排序数组，还会根据property进行排序，创建一个新的数组。
</div>

### 使用

```ts

sort<T>( array: readonly T[], ...list: { order?: 'asc'|'des', by?: T => any }[] ): T[]

```

### 参数

1. array(Array): 检查的数组
2. order?: string : 升序降序，默认 asc 升序
3. by?: T => T : 排序的函数

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
