### 引入

```js
import { t_plate } from "grantlibs";
或;
const { t_plate } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  校验车牌号
</div>

### 使用

```ts

t_plate(plate: string): boolean

```

### 参数

plate: string

### 返回

boolean: 是否正确

### 示例

```js
const plate = "京JB1295";
const res = t_plate(plate);
// => true
```
