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

## str 字符串

## 容器的切片

## set 集合

## dict（字典，映射）

## 容器的通用操作
