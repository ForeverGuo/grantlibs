### 引入

```js
import { group } from "grantlibs";
或;
const { group } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  类似 Object.groupBy 函数
</div>

### 使用

```ts

group<T, Tkey>( array: readonly T[], (value: T) => Tkey ): Record<Tkey, T[]>

```

### 参数

1. array(Array): 检查的数组
2. (value: T) => Tkey : 划分属性

### 返回

Record<Tkey, T[]>: 返回划分后的对象。

### 示例

```js
group([6.1, 4.2, 6.3], Math.floor);
// => { 4: [4.2], 6: [6.1, 6.3] }

group([6.1, 4.2, 6.3], (value) => (value > 5 ? ">5" : "<=5"));
// => { '<=5': [4.2], '>5': [6.1, 6.3] }
```
