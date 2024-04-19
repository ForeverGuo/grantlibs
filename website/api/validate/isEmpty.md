### 引入

```js
import { isEmpty } from "grantlibs";
或;
const { isEmpty } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  isEmpty (string , null , object , undefined)
</div>

### 使用

```ts

isEmpty(value): boolean

```

### 参数

- value: string | null | object | undefined

### 返回

boolean: true or false

### 示例

```js
const bool1 = isEmpty({});
// => true
const bool2 = isEmpty({ a: 2, c: 3 });
// => false
```
