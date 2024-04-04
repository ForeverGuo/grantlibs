### 引入

```js
import { subsOn } from "grantlibs";
或;
const { subsOn } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  订阅事件
</div>

### 使用

```ts

subsOn(name: string, fn: Function)

```

### 参数

- name: string
- fn: Function【不支持匿名函数】

### 返回

无

### 示例

```js
subsOn("test", function t1() {
  console.log("hello world");
});
```
