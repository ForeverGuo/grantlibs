### 引入

```js
import { store } from "grantlibs";
或;
const { store } = require("grantlibs");
```

### 方法列表

| 方法名         | 调用方式       |
| -------------- | -------------- |
| 设置           | store.set()    |
| 获取           | store.get()    |
| 检查是否有设置 | store.has()    |
| 删除缓存       | store.delete() |
| 缓存的长度     | store.size()   |

### 代码示例

```js
/* 设置缓存 键名为任意值 */
store.set("name", "store");

/* 获取缓存 */
const val = store.get("name");

/* 检查是否有设置 */
const boolean = store.has("name"); // true

/* 删除缓存 */
const boolean = store.delete("name"); // true

/* 缓存的长度 */
const size = store.size();
```
