## 函数定义

- 组织好的，可重复使用的，用来实现特定功能的代码段

```js
def my_fn 函数名(params 参数):
  函数体
  return 返回值
```

## 函数参数

## 函数返回值

## 函数说明文档

```js
def add(x, y):
  """
    add函数接收两个参数，进行2个数相加
    :param x
    :param y
    :return result
  """
  result = x + y
  return result
```

## 函数的嵌套使用

- 在一个函数中执行另一个函数

```js
def func_a():
  print(1)

def func_b():
  print(2)
  func_a()
```

## 变量的作用域

- 局部变量

  定义在函数体内的变量，即只在函数体内生效

- 全局变量

  函数体内，外都能生效的变量

- global 关键字

  函数内部声明变量为全局变量
