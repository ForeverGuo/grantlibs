### 引入

```js
import { getHour } from "grantlibs";
或;
const { getHour } = require("grantlibs");
```

### 方法列表

| 方法名       | 调用方式  | 返回值 |
| ------------ | --------- | ------ |
| 获取当前小时 | getHour() | 数值   |

### 代码示例

```js
const time = getHour();
console.log(time); // 22
```
