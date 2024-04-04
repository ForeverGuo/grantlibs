### 引入

```js
import { subsOnce } from "grantlibs";
或;
const { subsOnce } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  只触发一次事件
</div>

### 使用

```ts

subsOnce(name: string, fn: Function)

```

### 参数

- name: string
- fn: Function【不支持匿名函数】

### 返回

无

### 示例

```js
subsOnce("test", function t1() {
  console.log("hello world");
});
subsEmit("test");
// => 只能执行一次 输出 hello world
// subsEmit("test");
// => 执行失败
```
