### 引入

```js
import { maxCalls } from "grantlibs";
或;
const { maxCalls } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  创建一个函数并最多调用n次，达到n次后结果不变。
</div>

### 使用

```ts
maxCalls(func: T,n: number)

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
const limitAddCount = maxCalls(addCount, 2);
limitAddCount();
// => 1
limitAddCount();
// => 2
limitAddCount();
// => 2
```
