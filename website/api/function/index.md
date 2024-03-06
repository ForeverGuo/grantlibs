### 引入

```shell
  import { debounce } from 'grantlibs'
  或
  const { debounce } = require('grantlibs')
```

### 方法列表

| 方法名         | 调用方式       |
| -------------- | -------------- |
| 取消执行        | debounce().cancel()    |
| 立即执行        | debounce().flush()    |

### 代码示例

```js
  const test = debounce(() => { console.log('hello world') }, 3000);
  test()
  // 取消执行
  test.cancel()
  const promise = debounce(() => { return 'hello world' }, 3000);
  // 返回 promise
  promise().then(r => { console.log(r) })
```
