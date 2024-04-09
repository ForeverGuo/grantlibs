### 引入

```js
import { memorize } from "grantlibs";
或;
const { memorize } = require("grantlibs");
```

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  创建一个函数并缓存指定时间的内容。
</div>

### 使用

```ts
memorize(func: T,options: { resolver?: (...args) => string, ttl?: number }): T & { cache: Cache }

```

### 参数

- func: 执行函数
- options:
  - resolver: 非必传[创建缓存 key 值] <span style="color: red">返回字符串类型</span>
  - ttl: 非必传[缓存时间]

### 返回

T & { cache: Cache }: 函数和 cache

### 示例

```js
function fibonacci(n: number) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memorize(fibonacci, { ttl: 1000 });
console.log(memoizedFib(10));
// => 55
console.log(memoizedFib(10));
// => 55

console.log(memoizedFib.cache);
// => Map(1) { '10' => [ 55, 1712663444783 ] }
console.log(memoizedFib.cache.get("10"));
// => [ 55, 1712663444783 ]
```
