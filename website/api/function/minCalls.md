### 引入

```js
import { minCalls } from "grantlibs";
或;
const { minCalls } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  创建一个函数并执行 > n次后，开始调用函数。
</div>

### 使用

```ts
minCalls(func: T,n: number)

```

### 参数

- func: 执行函数
- n: 执行次数

### 返回

T: 函数

### 示例

```js
let count = 0;
const addCount = () => ++count;
const limitAddCount = minCalls(addCount, 2);
limitAddCount();
// => undefined
limitAddCount();
// => undefined
limitAddCount();
// => 1
```
