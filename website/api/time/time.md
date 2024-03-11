### 引入

```js
import { getTime } from "grantlibs";
或;
const { getTime } = require("grantlibs");
```

### 方法列表

| 方法名       | 调用方式  | 返回值   |
| ------------ | --------- | -------- |
| 获取当前时间 | getTime() | 10:00:00 |

### 代码示例

```js
const time = getTime();
console.log(time); // 22:10:10
```
