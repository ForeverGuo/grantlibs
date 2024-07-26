## list 列表

- 支持多种不同类型，嵌套
- 索引时从 0 依次递增

```js
变量名称 = [];
变量名称 = list();

list_1 = [1, 2, 3, "hello"];

// 常用操作方法
// 查找索引
num = list_1.index("hello");
// 修改指定索引的值
list_1[1] = "world";
// insert 插入元素
list_1.insert(1, 4);
// append 向容器尾部追加一个元素
list_1.append(5);
// extend 尾部追加一批元素
list_1.extend([1, 2, 3]);

// 删除
del list_1[1]
// pop 移除元素并返回该元素
ele = list_1.pop(1)

// remove 只删除匹配的第一个元素
list_1.remove("hello")

// 列表清空
list_1.clear()

// count 统计某个元素的个数
count_1 = list_1.count(1)

// len 列表的元素数量
count = len(list_1)

```

::: tip

- 可以容纳多个元素
- 可以容纳不同类型的元素
- 数据是有序存储的
- 允许数据重复
- 可以修改
  :::

## tuple 元组

- 使用小括号，元组的元素不能修改(增加/删除)
- 括号中添加元素，并用逗号分隔，可以是不同的数据类型
- 使用场景：不希望封装的数据被修改

```js
tup1 = ("h", "e", "l");
tup2 = "w", "o";

// 定义单个元组
tup3 = ("hello",)

// 元组的嵌套
tup4 = ((1,2,3),(4,,5,6))

// 访问元组 下标索引
print(tup1[0]);

// 修改元组  元组的元素是不可以修改，可以进行连接组合
tup3 = tup1 + tup2;

// 删除元组
del tup1;

// index() 查找某个元素的下标

// count() 统计某个元素出现的次数

// len(元组) 统计元组内的元素个数
```

## str 字符串

- 字符串是字符的容器，可以存放任意数量的字符
- 不可修改

```js
str_1 = "hello world";

// index() 查找索引
str_1.index("w");

// replace(str1, str2) 返回一个新字符串
new_str = str_1.replace("h", "k");

// split() 返回一个list
new_list = str_1.split(" ");

// strip() 去除空格
new_strip = str_1.strip();

// count() 统计某元素的次数

// len() 统计字符串的长度
```

## 容器的切片

- 序列连续，有序，可使用下标索引的一类数据容器
- 切片：从一个序列中，取出一个子序列

```js
// list[开始下标 ：结束下标 ： 步长]
// 起始可以省略，表示从头到尾
// 步长可以省略，默认为 1， 为负数 表示倒序执行
list_1 = [1,2,3,4,5]
list_2 = list_1[1:4]
```

## set 集合

- 无序存储，不支持下标索引访问
- 支持不同类型的数据
- 不允许重复数据
- 可以修改
- 支持 for 循环

```js
set_1 = {"a", "b", "c"};
set_empty = set()

// add 添加元素
set_1.add("d")

// remove 移除元素
set_1.remove("a")

// 随机取出一个元素 pop
element = set_1.pop()

// 清空
set_1.clear()

// 取2个集合的差集 集合1.difference(集合2)
set_2 = { 1, 2, 3 }
set_3 = { 1, 5, 6 }
set_4 = set_2.difference(set_3)

// 消除2个集合的差集 集合1.difference_update(集合2)
// 改变集合1的内容, 无返回值
set_2.difference_update(set_3)
// => set_2 = { 2, 3 }

// 2个集合合并 集合1.union(集合2)
// 合并为一个新的集合并返回
new_set = set_2.union(set_3)
// => { 1, 2, 3, 5, 6 }

// 统计集合的元素数量 len()
len_1 = len(set_2)

// 集合的遍历
// 集合不支持下标索引，不支持while循环

```

## dict（字典，映射）

- 定义

```js
dict_1 = { a: 1, b: 2 };
dict_2 = dict();

// 删除 dict.pop(key) 并返回该元素的值
dict_1.pop("a");
// 清空 dict.clear()
dict_1.clear();
// 获取全部key  dict.keys()
dict_keys = dict_1.keys();
// 1, 根据获取全部keys 遍历获取
// 2, 直接使用for in

// 统计字典内的元素数量 len()
count = len(dict_1);
```

:::warning

- 不可以使用下标索引
- key 和 value 可以是任意数据类型（key 不可为字典）
- key 不可以重复，如果已存在，就是更新 value 值
- 可以修改
- 支持 for 循环，不支持 while 循环
  :::

## 容器的通用操作

- min() 最小元素
- max() 最大元素
- len() 长度
- list(容器) - 转换为列表
- str(容器) - 转换为字符串
- tuple(容器) - 转换为元组
- set(容器) - 转换为集合
- sorted(容器, [reverse=True]) - 将容器进行排序，reverse 表示降序

```js
// max
```

## 字符串比较

- 从左到右依次比较大小，只要大的就大，字母比较 ASC
