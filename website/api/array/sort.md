### 引入

```js
import { sort } from "grantlibs";
或;
const { sort } = require("grantlibs");
```

### 方法列表

| 方法名 | 调用方式                                      | 返回值  |
| ------ | --------------------------------------------- | ------- |
| 排序   | sort([],{ order: 'asc', by: item => item.a }) | array[] |

### 代码示例

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
