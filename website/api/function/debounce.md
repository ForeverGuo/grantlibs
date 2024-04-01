### 引入

```js
import { debounce } from "grantlibs";
或;
const { debounce } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  防抖函数，提高性能。
</div>

### 使用

```ts

debounce(fn: () => {}, wait: number, flag: boolean): Function

```

### 参数

- fn: 执行函数
- wait: 等待时间
- flag: 立即执行

### 返回

function: 执行函数

### 示例

```js
const test = debounce(() => {
  console.log("hello world");
}, 3000);
test();
// 取消执行
test.cancel();
const promise = debounce(() => {
  return "hello world";
}, 3000);
// 返回 promise
promise().then((r) => {
  console.log(r);
});
```
