## 文件编码

- 编码就是一种规则集合，记录了内容和二进制之间进行相互转换的逻辑

## 文件读取

- open(name, mode, encoding)
  1. name: 文件名字
  2. 打开模式 rwa r - 读 w - 写 a - 追加
  3. 编码格式

```js
// f 文件对象
f = open("index.text", "r", (encoding = "UTF-8"));
// read() 读取多少字节
f.read();
// readlines() 读取全部行
lines = f.readlines();
// readline() 每次只读取一行
one_line = f.readline();
// 解除文件的占用
f.close;
// with open() as f 对文件进行操作 自动执行close文件关闭
```

## 文件的写入操作

- write()

```js
// 打开文件
f = open("", "w", (encoding = "UTF-8"));
// 写入内存 如果内容存在，则会清空原有内容，并重新写入
f.write();
// 刷新，将内存缓冲区中内容写入到硬盘中，避免频繁操作硬盘
f.flush();
// close 方法内置 flush方法
f.close();
```

## 文件的追加

```js
// 如果没有文件则创建新文件，并写入内容，如果有文件，则追加内容
f = open("", "a", (encoding = "UTF-8"));
// 写入内存 如果内容存在，则会清空原有内容，并重新写入
f.write();
// 刷新，将内存缓冲区中内容写入到硬盘中，避免频繁操作硬盘
f.flush();
// close 方法内置 flush方法
f.close();
```
