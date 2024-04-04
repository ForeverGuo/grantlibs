### 引入

```js
import { subsEmit } from "grantlibs";
或;
const { subsEmit } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  触发事件
</div>

### 使用

```ts

subsEmit(name: string)

```

### 参数

- name: string

### 返回

无

### 示例

```js
subsEmit("test");
// => hello world
```
