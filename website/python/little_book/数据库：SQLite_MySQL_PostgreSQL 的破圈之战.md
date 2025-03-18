# 数据库类型对比

| 维度         | SQLite                       | MySQL                           | PostgreSQL                     |
| ------------ | ---------------------------- | ------------------------------- | ------------------------------ |
| 类型         | 嵌入式数据库                 | 关系型数据库管理系统 (RDBMS)    | 对象-关系型数据库 (ORDBMS)     |
| 架构         | 无服务端，单文件存储         | 客户端-服务器架构               | 客户端-服务器架构              |
| 事务支持     | ACID 兼容（默认启用）        | ACID 兼容（需使用 InnoDB 引擎） | 完整 ACID 兼容                 |
| 并发处理     | 写操作全局锁                 | 行级锁 + MVCC (InnoDB)          | 多版本并发控制 (MVCC)          |
| 扩展性       | 单机，适合轻量级应用         | 支持主从复制、分片              | 支持复杂复制、并行查询         |
| 典型应用场景 | 移动应用、小型工具、本地缓存 | 中小型 Web 应用                 | 复杂查询、地理空间数据、大数据 |

## SQLite

### 安装与配置

#### 无需独立安装 (多数编程语言内置支持)

```python
import sqlite3 # Python
```

#### 创建/连接数据库

```python
import sqlite3

# 连接数据库（不存在则创建）
conn = sqlite3.connect('mydatabase.db')
cursor = conn.cursor()
```

### 核心操作

#### 表操作

```python
-- 创建表
CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
email TEXT UNIQUE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 删除表
DROP TABLE IF EXISTS users;
```

#### 数据操作

```python
-- 插入数据
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');

-- 查询数据
SELECT * FROM users WHERE name LIKE 'A%';

-- 更新数据
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- 删除数据
DELETE FROM users WHERE id = 2;
```

#### 事务操作

```python
try:
cursor.execute("BEGIN TRANSACTION")
cursor.execute("INSERT INTO logs (message) VALUES ('Operation start')")
cursor.execute("COMMIT")
except sqlite3.Error as e:
cursor.execute("ROLLBACK")
print(f"Transaction failed: {e}")
```

### 性能优化

#### 启用 WAL 模式

```python
PRAGMA journal_mode = WAL; -- 提升并发读性能
```

#### 调整缓存大小

```python
PRAGMA cache_size = -10000; -- 设置10MB缓存
```

#### 批量插入优化

```python
# 使用 executemany 和事务
data = [('Bob', 'bob@test.com'), ('Charlie', 'charlie@test.com')]
cursor.execute("BEGIN TRANSACTION")
cursor.executemany("INSERT INTO users (name, email) VALUES (?, ?)", data)
cursor.execute("COMMIT")
```

## MySQL

### 安装与配置

#### ububtu 系统

```shell
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation # 安全配置（设置 root 密码、移除匿名用户等）
```

#### 配置文件路径:

```python
Linux: /etc/mysql/my.cnf 或 /etc/my.cnf
Windows: C:\ProgramData\MySQL\MySQL Server X.X\my.ini
```

#### 修改字符集为 UTF-8:

```python
[mysqld]
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

#### 创建用户

```python
CREATE USER 'app_user'@'192.168.1.1' IDENTIFIED BY 'your_password';
```

#### 授予权限

```python
-- 授予所有数据库的读写权限
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'%' WITH GRANT OPTION;

-- 授予特定数据库权限
GRANT SELECT, INSERT, UPDATE ON mydb.* TO 'app_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 核心操作

#### 数据库操作

```python
-- 创建数据库
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 切换DB
USE mydb;
```

#### 表操作

```python
-- 创建表
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL,
email VARCHAR(100) UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 查看表结构
DESCRIBE users;
```

#### 数据操作

```python
-- 插入数据
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
-- 模糊查询
SELECT * FROM users WHERE name LIKE 'A%';
-- 更新数据
UPDATE users SET email = 'new@example.com' WHERE id = 1;
-- 删除数据
DELETE FROM users WHERE id = 2;
```

#### 事务管理

```python
START TRANSACTION;
INSERT INTO orders (user_id, amount) VALUES (1, 100);
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
COMMIT; -- 提交事务

-- 发生错误时回滚
ROLLBACK;
```

### 备份与恢复

#### 逻辑备份

```python
-- 导出全部数据库
mysqldump -u root -p --all-databases > full_backup.sql
-- 导出单个数据库
mysqldump -u root -p mydb > mydb_backup.sql
```

#### 物理备份

```python
xtrabackup --backup --user=root --password=your_password --target-dir=/backup/
```

#### 自动备份(cron 任务)

```python
# 每天凌晨 2 点备份
0 2 * * * /usr/bin/mysqldump -u root -p'password' mydb > /backup/mydb_$(date +\%F).sql
```

## 日常问题

#### 如何处理死锁（Deadlock）？

- **查看死锁日志:**

```python
SHOW ENGINE INNODB STATUS; -- 查看 LATEST DETECTED DEADLOCK 部分
```

- **优化事务逻辑:**

. 按固定顺序访问表

. 减少事务执行时间

- **重试机制:**

```python
# Python 示例
import mysql.connector
from mysql.connector import errors

try:
cursor.execute("UPDATE accounts SET balance = balance - 100 WHERE user_id = 1")
except errors.DatabaseError as e:
if 'Deadlock' in str(e):
print("检测到死锁，正在重试...")
# 重试逻辑
```

## PostgreSQL

### 安装与配置

#### ububtu 系统

```shell
sudo apt update
sudo apt install postgresql postgresql-contrib # 包含扩展组件
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 配置文件路径:

```python
主配置文件: /etc/postgresql/<version>/main/postgresql.conf

访问控制文件: /etc/postgresql/<version>/main/pg_hba.conf
```

#### 允许远程访问:

```python
-- 修改 postgresql.conf:
listen_addresses = '*' # 允许所有IP
-- 修改 pg_hba.conf:
host all all 0.0.0.0/0 md5
-- 重启服务
sudo systemctl restart postgresql
```

#### 创建用户与数据库:

```shell
sudo -u postgres psql
CREATE USER app_user WITH PASSWORD 'your_password';
CREATE DATABASE mydb OWNER app_user;
```

#### 授予权限:

```shell
GRANT ALL PRIVILEGES ON DATABASE mydb TO app_user;
GRANT SELECT, INSERT ON my_table TO app_user;
```

### 核心操作

#### 数据库操作

- **连接数据库**

```python
psql -U app_user -d mydb -h 127.0.0.1
```

- **创建表**

```python
CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
profile JSONB,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- **查看表结构**

```python
\d+ users -- 查看表详情
```

#### 数据操作

- **插入数据:**

```python
INSERT INTO users (name, profile)
VALUES ('Alice', '{"age": 30, "role": "admin"}');
```

- **查询 JSON 字段:**

```python
SELECT name, profile->>'role' AS role
FROM users
WHERE profile @> '{"role": "admin"}';
```

- **事务管理:**

```python
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
INSERT INTO transactions (user_id, amount) VALUES (1, -100);
COMMIT;
```

## 日常问题

#### 如何处理大表性能问题？

- **分区表**

```python
CREATE TABLE logs_partitioned (
log_date DATE,
message TEXT
) PARTITION BY RANGE (log_date);

CREATE TABLE logs_2023 PARTITION OF logs_partitioned
FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
```

- **使用 BRIN 索引:**

```python
CREATE INDEX idx_logs_time ON logs USING brin (log_time);
```

##### 本地 AI 知识库搭建, 你感兴趣么 ?
