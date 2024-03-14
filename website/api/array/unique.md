### 引入

```js
import { unique } from "grantlibs";
或;
const { unique } = require("grantlibs");
```

### 方法列表

<table width="820" cellspacing="0">
  <tr>
    <th align="left">方法名</th>
    <th align="center">调用方式</th>
    <th align="center">参数 1</th>
    <th align="center">参数 2</th>
    <th align="center">返回值</th>
  </tr>
  <tr>
    <td>去重唯一值</td>
    <td>unique(params1, params2)</td>
    <td>数组[]</td>
    <td>可选，根据字段去重，(a, b) => a.name === b.name</td>
    <td>数组[]</td>
  </tr>
</table>

### 代码示例

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
