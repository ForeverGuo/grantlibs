### 引入
```shell
  import { idCard } from 'grantguo-libs'
  或
  const { idCard } = require('grantguo-libs')
```

### 方法列表

|  方法名   | 调用方式  |
|  ----  | ----  |
| 获取出生年月  | idCard.birthday() |
| 获取性别  | idCard.sex() | 

### 代码示例

```js
  /* 获取出生年月 */
  const card = '110101199001013590'
  const date = idCard.birthday(card)

  /* 获取性别 */
  const card = '110101199001013590'
  const sex = idCard.sex(card)
```