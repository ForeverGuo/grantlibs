### 引入
```shell
  import { test } from 'grantguo-libs'
  或
  const { test } = require('grantguo-libs')
```

### 方法列表

|  方法名   | 调用方式  |
|  ----  | ----  |
| 校验手机号  | test.mobile() |
| 校验邮箱  | test.email() | 
| 校验身份证  | test.idCard() | 
| 校验车牌号  | test.plate() |   

### 代码示例

```js
  /* 校验手机号 */
  const mobile = 17704052506
  const res = test.mobile(`${mobile}`)
  /* 校验邮箱 */
  const email = '810153274@qq.com'
  const res = test.email(email)
  /* 校验身份证 */
  const idcard = '110101199001013590'
  const res = test.idCard(idcard)
  /* 校验车牌号 */
  const plate = '京JB1295'
  const res = test.plate(plate)
```