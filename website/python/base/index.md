## 字面量

### 掌握字面量的含义

- 代码中被写来的固定的词

### 了解常见的字面量

### 基于 print 语句完成各类字面量的输出

## 注释

- 单行注释
- 多行注视

## 变量

- 在程序运行时，能储存计算结果或能表示值的抽象概念

## 数据类型

- 整型
- 浮点型
- 复数
- 布尔型
- 字符串
- 列表
- 元组
- 集合
- 字典

::: tip
变量无类型，数据有类型
:::

## 数据类型转换

- 字符串，整数，浮点数之间进行相互转换
- int(x) 将 x 转换为整数
- float(x) 将 x 转换为浮点数
- str(x) 将 x 转换为字符串

## 标识符

- 用户在编程过程中，使用的一系列名字，用于给边量，类，方法等命名
- 命名规则：

  1. 内容限定（英文，中文，数字，下划线），数字不可以开头
  2. 大小写敏感
  3. 不可使用关键字

## 运算符

1. - 加法
2. - 减法
3. - 乘法
4. / 除法
5. // 取整除
6. % 取余
7. \*\* 指数

## 字符串

### 字符串扩展

- 单引号 ''
- 双引号 ""
- 三引号 """

### 字符串格式化

- % 表示 占位
- s 表示 将变量变成字符串放入占位的地方
- 数字精度控制（m.n 的形式控制数据的宽度和精度）：
  1. m: 设置的宽度小于数字自身，不生效
  2. n: 控制小数点精度，要求是数字，会进行小数的四舍五入
- f"内容{变量}"的格式进行格式化
- 表达式进行字符串格式化

## 数据输入

- input("提示信息--") 键盘输入（输出类型固定是字符串类型）
- print 内容输出

## 异常捕获

```js
// 基本异常
try:
  // 可能发生的错误代码
except:
  // 如果出现异常需要执行的代码

// 捕获指定异常

try:
// 只捕获 nameError 错误
except NameError as e:
  print(e)

// 捕获多个异常
try ：

except (NameError, ZeroDivisionError) as e:
  print(e)

// 捕获所有的异常
try:

except Exception as e:
  print(e)

// else 没有异常会执行
try:
except Exception as e:
  print(e)
else:
  print("没有异常执行")
finally:
  f.close()
  print("无论有没有异常都会执行")
```

- 异常具有传递性
