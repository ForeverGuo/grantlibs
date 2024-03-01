### clone 的使用

|  方法名   | 调用方式  |
|  ----  | ----  |
| 深度拷贝  | close.deep() |
| 浅拷贝  | close.shallow() |  

```js
  const obj = {
    a: 1,
    b: 'hello',
    c: [ 1, 2, 3 ],
    d: { e: 'nested', f: [ 4, 5, 6 ] }
  }
  /* 深度拷贝 */
  const deepObj = clone.deep(obj)
  /* 深度拷贝 */
  const shallowObj = clone.shallow(obj)
```