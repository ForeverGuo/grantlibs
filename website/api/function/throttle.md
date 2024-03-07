### 引入

```shell
  import { throttle } from 'grantlibs'
  或
  const { throttle } = require('grantlibs')
```

### 代码示例

```js
const test = throttle(() => {
  console.log("hello world");
}, 3000);
test(); // 3s 后 输出 hello world
```
