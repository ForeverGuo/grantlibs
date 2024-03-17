### 引入

```js
import { difference } from "grantlibs";
或;
const { difference } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  创建一个具有唯一array值的数组，每个值不包含在其他给定的数组中。（注：即创建一个新数组，这个数组中的值，为第一个数字（array 参数）排除了给定数组中的值。）该方法使用SameValueZero做相等比较。结果值的顺序是由第一个数组中的顺序确定。
</div>

### 使用

```ts

difference<T>( array: readonly T[], ...rest: any[] ): unknow[]

```

### 参数

1. array(Array): 检查的数组
2. rest: 排除的值或自定义去除函数

### 返回

(Array): 返回一个具有唯一 array 值的新数组。

### 示例

```js
difference([3, 2, 1], [4, 2], [5]);
// => [3, 1]

const compareByFloor = (a, b) => Math.floor(a) === Math.floor(b);
difference([1.2, 3.1], [1.3, 2.4], compareByFloor);
// => [3.1]

const arr1 = [
  { id: 1, name: "Yeet" },
  { id: 3, name: "John" },
];
const arr2 = [
  { id: 3, name: "Carl" },
  { id: 4, name: "Max" },
];

difference(arr1, arr2, (a, b) => a.id === b.id);
// => [{ id: 1, name: 'Yeet' }]
```
