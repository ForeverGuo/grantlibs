### 引入

```js
import { throttle } from "grantlibs";
或;
const { throttle } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  节流函数，节约资源。
</div>

### 使用

```ts

debounce(fn: () => {}, wait: number): Function

```

### 参数

- fn: 执行函数
- wait: 等待时间

### 返回

function: 执行函数

### 示例

```js
const test = throttle(() => {
  console.log("hello world");
}, 3000);
test(); // 3s 后 输出 hello world
```
