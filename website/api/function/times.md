### 引入

```js
import { times } from "grantlibs";
或;
const { times } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  执行函数次数 并返回数组。
</div>

### 使用

```ts

times<TInput>(func: (index: number) => TInput, n: number): TInput[]

```

### 参数

- func: 执行函数, 入参默认是 index
- n: 执行次数

### 返回

array: 数组

### 示例

```js
const res1 = times((index) => `run ${index}`, 3);
// => ['run 0', 'run 1', 'run 2']

const res2 = times(() => 0, 3);
// => [0, 0, 0]
```
