## Python 环境搭建

为了开始 Python 编程之旅，首先需要搭建 Python 环境。以下是简洁的环境搭建步骤：

1. **安装 Python**
   - 访问 [Python 官方网站](https://www.python.org/) 下载最新版本的 Python 安装包。
   - 按照安装向导完成安装，确保勾选“Add Python to PATH”选项。

2. **安装集成开发环境 (IDE)**
   - **PyCharm**：功能强大，适合大型项目开发，有社区版和专业版。
   - **VS Code**：轻量级但功能丰富，可通过插件扩展功能，适合各种规模项目。
   - **Jupyter Notebook**：适合数据科学和机器学习，支持交互式编程。

3. **验证安装**
   - 打开命令提示符或终端，输入 `python --version` 检查 Python 是否安装成功。
   - 输入 `pip --version` 检查 pip 是否可用，pip 是 Python 的包管理工具。

4. **安装常用库**
   - 使用 `pip install` 命令安装所需库，如 `numpy`、`pandas` 等。

推荐开发工具：
- **PyCharm**：适合初学者和专业开发者，提供智能代码补全、调试工具等功能。
- **VS Code**：轻量且灵活，支持多种编程语言，拥有丰富的插件生态系统。
- **Jupyter Notebook**：专为数据科学家设计，支持代码、文本、图表的混合编写。

## 基础语法 

### 变量与数据类型

- **变量：无需声明类型，直接赋值。**
    
```
name = "Alice"
age = 25
height = 1.68
is_student = True
```
- **数据类型：**

```
整数：int（如 10）

浮点数：float（如 3.14）

字符串：str（如 "Hello"）

布尔值：bool（如 True、False）

列表：list（如 [1, 2, 3]）

元组：tuple（如 (1, 2, 3)）

字典：dict（如 {"name": "Alice", "age": 25}）

集合：set（如 {1, 2, 3}）
```

### 输入与输出

- **输出**
```
print("Hello, World!")
```

- **输入**

```
name = input("Enter your name: ")
print(f"Hello, {name}!")
```

### 运算符

- 算术运算符：+, -, *, /, //（整除）, %（取余）, **（幂）
- 比较运算符：==, !=, >, <, >=, <=
- 逻辑运算符：and, or, not
- 赋值运算符：=, +=, -=, *=, /=

## 控制流

- **条件语句**
  - if-elif-else：
```
age = 18
  if age < 18:
      print("未成年")
  elif age == 18:
      print("刚成年")
  else:
      print("成年")
```
- **循环**
  - for 循环：
```
for i in range(5):
    print(i)
```
  - while 循环：
```
count = 0
while count < 5:
    print(count)
    count += 1
```

## 函数

- **定义函数:**

```
def greet(name):
    return f"Hello, {name}!"
```

- **调用函数:**

```
print(greet("Bob"))
```

- **默认参数:**

```
def greet(name="Guest"):
    return f"Hello, {name}!"
```

- **Lambda 函数:**

```
square = lambda x: x ** 2
print(square(5))  # 输出: 25
```

## 数据结构

### 列表（List）

- **创建列表:**
```
fruits = ["apple", "banana", "cherry"]
```
- **常用操作:**

```
fruits.append("orange")  # 添加元素
fruits.remove("banana")  # 删除元素
print(fruits[0])         # 访问元素
```

### 字典（Dictionary）

- **创建字典:**

```
person = {"name": "Alice", "age": 25}
```

- **常用操作:**

```
print(person["name"])  # 访问值
person["age"] = 26     # 修改值
person["city"] = "New York"  # 添加键值对
```


### 集合（Set）

- **创建集合:**

```
numbers = {1, 2, 3}
```

- **常用操作:**

```
numbers.add(4)  # 添加元素
numbers.remove(2)  # 删除元素
```

### 元组（Tuple）

- **创建元组(不可变特性):**

```
tup1 = (1, "a", [2, 3]) 
tup3 = 10, "b", True  # 等价于 (10, "b", True)‌
```

- **常用操作:**

```
print(tup1)   # 输出: 1, 索引从 0 开始访问
subtup2 = tup1[1:3]   # 切片操作 输出：("a", [2, 3])‌
length = len(tup1) # 元素总数 输出: 3
idx = tup1.index("a") # 获取元素的索引 输出: 1
cnt = tup1.count("a") # 统计元素出现的次数 输出: 1
```

## 文件操作

### 基础语法

- **open函数**

  open(file, mode='r', buffering=-1, encoding=None)
  
| 名称    |  用法   |
| --- | --- |
|   file  |  文件路径（支持绝对路径和相对路径）‌   |
|   mode | 打开模式，默认 'r'（只读） |
|   buffering | 设置缓存区 ('-1': 默认系统自动分配) |
|   encoding | 指定编码（如 'utf-8'，处理中文文件必填）‌ |


### 读取文件

```
with open("file.txt", "r") as file:
    content = file.read()
    print(content)
```

### 写入文件

```
with open("file.txt", "w") as file:
    file.write("Hello, World!")
```
## 异常处理

### try-except

- **常见报错类型**

|  名称   |   类型  |
| --- | --- |
|  语法与结构错误   |  SyntaxError   |
|   变量与类型错误  |  NameError/TypeError   |
|  数据容器错误   |  IndexError‌/KeyError   |
| 运算与输入输出错误 | ZeroDivisionError‌ |
| 模块与编码错误 | ImportError/ModuleNotFoundError‌ |

```
try:
    result = 10 / 0
except ZeroDivisionError:
    print("不能除以零")
```

## 模块与包

### 导入模块

```
import math # 系统模块
print(math.sqrt(16))  # 输出: 4.0
```

### 安装第三方包


```
pip install requests
```


### 使用第三方包


```
import requests
response = requests.get("https://www.example.com")
print(response.status_code)
```

##  面向对象编程（OOP）

### 定义类

```
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hello, my name is {self.name}."
```

### 创建对象


```
person = Person("Alice", 25)
print(person.greet())
```

### 三大特性

- **封装**

  将数据（属性）和操作（方法）封装在类中，通过访问控制（如私有属性 _var）隐藏实现细节‌

- **继承**

```
class Bob(Person):
    _hobby = "music"  # 类似有属性
    def sing(self):
        print("sing.")
```


- **多态**

  - 基于类继承的多态示例
  
```
# 基类定义  
class Animal:  
    def make_sound(self):  
        pass  

# 子类重写方法  
class Dog(Animal):  
    def make_sound(self):  
        print("汪汪！")  

class Cat(Animal):  
    def make_sound(self):  
        print("喵喵！")  

# 多态调用函数  
def animal_sound(animal_obj):  
    animal_obj.make_sound()  

# 使用示例  
dog = Dog()  
cat = Cat()  

animal_sound(dog)  # 输出：汪汪！‌ 
animal_sound(cat)  # 输出：喵喵！‌

```

  - 函数多态示例（鸭子类型）
  
```
class Car:  
    def run(self):  
        print("汽车行驶")  

class Bicycle:  
    def run(self):  
        print("自行车骑行")  

def start(vehicle):  
    vehicle.run()  

# 调用示例  
start(Car())      # 输出：汽车行驶  
start(Bicycle())  # 输出：自行车骑行  

```
‌核心逻辑‌：只要对象实现了 run 方法，即可传入 start 函数，无需强制继承同一基类‌

## 实践练习

- **练习 1：** 编写一个程序，计算列表中所有数字的平均值。

- **练习 2：** 编写一个函数，判断一个字符串是否是回文。

- **练习 3：** 使用面向对象编程，设计一个简单的“学生管理系统”。






