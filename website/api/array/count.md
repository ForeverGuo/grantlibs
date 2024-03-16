### 引入

```js
import { count } from "grantlibs";
或;
const { count } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  数组（array）进行查找对应属性(可自定义)出现的次数
</div>

### 使用

```ts

chunk<T, Tkey>( array: readonly T[], (value: T) => Tkey ): Record<Tkey, number>

```

### 参数

1. array(Array): 检查的数组
2. (value: T) => Tkey : 每条数据的属性(可自定义)

### 返回

Record<Tkey, number>: 返回指定属性及出现的次数。

### 示例

```js
const array = [
  { id: 1, name: "hony", active: true },
  { id: 2, name: "hony", active: false },
  { id: 1, name: "tony", active: true },
];
count(array, (value) => (value.active ? "active" : "inactive"));
// => { 'active': 2, 'inactive': 1 }

count(array, (value) => value.id);
// => { 1: 2, 2: 1 }
```
