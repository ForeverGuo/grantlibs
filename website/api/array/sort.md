### 引入

```js
import { sort } from "grantlibs";
或;
const { sort } = require("grantlibs");
```

### 方法列表

<table width="750" cellspacing="0">
  <tr>
    <th align="left">方法名</th>
    <th align="center">调用方式</th>
    <th align="center">参数 1</th>
    <th align="center">参数 2</th>
    <th align="center">返回值</th>
  </tr>
  <tr>
    <td>排序</td>
    <td>sort(params1, params2)</td>
    <td>数组[]</td>
    <td>可选，{ order: 'asc' | 'des', by: item => item.a }</td>
    <td>数组[]</td>
  </tr>
</table>

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
