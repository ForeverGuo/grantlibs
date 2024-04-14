### 引入

```js
import { toDecorator } from "grantlibs";
或;
const { toDecorator } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  类方法装饰器
</div>

### 使用

```ts

toDecorator(func: Function): Function

```

### 参数

func: Function

### 返回

Function: 执行函数

### 示例

```js
function log(func: Function, message: string) {
  return function (...args: unknown[]) {
    console.log(message);
    return func(...args);
  };
}

const logger = toDecorator(log);

class TestClass {
  @logger("Hello world!")
  testMethod() {
    return 1;
  }
}

const instance = new TestClass();

instance.testMethod();

// => Hello world! 1
```
