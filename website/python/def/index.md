## 函数定义

- 函数代码块以 def 关键词开头，后接函数标识符名称和圆括号()
- 参数和字变量必须放在圆括号中间，定义参数
- return[表达式] 结束函数，不带表达式的 return 相当于返回 None

## 语法

```js
def functionname():
  "函数_字符串"
  function_suite
  return [expression]
```

## 可更改(mutable) 与 不可更改(immutable)对象

- strings, tuples 和 numbers 是不可更改的对象
- list，dict 等则是可以修改的对象

## 参数

- 必备参数 <br/>

  必备参数须以正确的顺序传入函数。调用时的数量必须和声明时的一样 <br/>

- 关键字参数

  关键字参数和函数调用关系紧密，函数调用使用关键字参数来确定传入的参数值。<br/>

- 默认参数

```js
def printinfo( name, age = 35 ):
   "打印任何传入的字符串"
   print "Name: ", name
   print "Age ", age
   return

// 调用printinfo函数
printinfo( age=50, name="miki" )
printinfo( name="miki" )
```

- 不定长参数

  处理多个参数，加了星号（\*）的变量名会存放所有未命名的变量参数 <br />

```js
// 可写函数说明
def printinfo( arg1, *vartuple ):
   "打印任何传入的参数"
   print "输出: "
   print arg1
   for var in vartuple:
      print var
   return

// 调用printinfo 函数
printinfo( 10 )
printinfo( 70, 60, 50 )
```

## 匿名函数

- lambda 只是一个表达式，函数体比 def 简单很多
- lambda 主体是一个表达式，而不是一个代码块
- lambda 函数拥有自己的命名空间，且不能访问自有参数列表或 全局命名空间的参数
