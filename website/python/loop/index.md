## while 循环

- 循环功能是程序中至关重要的基础

```js

while 条件判断：
  执行逻辑

```

## for 循环

- while 循环的循环条件是自定义的，自行控制循环条件
- for 循环是 轮训机制，是对内容的逐个处理

```js
for 临时变量 in 待处理数据集:
  循环满足条件时执行的代码
```

- range 获取数字序列
- range(num1)
- range(num1, num2)
- range(num1, num2, step)

::: tip
临时变量在规范上 不应该在 for 循环外部被访问
:::

## 循环中断 break 和 continue

- continue 中断本次循环，直接进入下一次循环
- break 循环结束
