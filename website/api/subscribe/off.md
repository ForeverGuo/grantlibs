### 引入

```js
import { subsOff } from "grantlibs";
或;
const { subsOff } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  取消订阅事件
</div>

### 使用

```ts

subsOff(name: string, fn: Function)

```

### 参数

- name: string
- fn: Function【不支持匿名函数】

### 返回

无

### 示例

```js
subsOn("testName", function t2() {
  console.info("test-1");
});
function t1() {
  console.info("test-2");
}
subsOn("testName", t1);
subsOff("testName", t1);
```
