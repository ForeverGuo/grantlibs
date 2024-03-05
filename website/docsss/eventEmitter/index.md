### 引入

```shell
  import { eventEmitter } from 'grantlibs'
  或
  const { eventEmitter } = require('grantlibs')
```

### 方法列表

| 方法名   | 调用方式            |
| -------- | ------------------- |
| 订阅     | eventEmitter.on()   |
| 发布     | eventEmitter.emit() |
| 取消订阅 | eventEmitter.off()  |
| 发布一次 | eventEmitter.once() |

### 代码示例

```js
eventEmitter.on("testName", () => {
  console.info("test-1");
});
eventEmitter.on("testName", () => {
  console.info("test-2");
});
eventEmitter.emit("testName");
```
