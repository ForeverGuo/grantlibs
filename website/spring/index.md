## spring 框架（IOC 和 AOP）

- 控制反转思想
  spring 帮你 new 对象
  spring 帮你维护对象和对象之间的关系

- 实现 IOC 思想的容器

  1. 控制反转的实现有多种，其中比较重要的是依赖注入（DI）
  2. 控制反转是思想，依赖注入是这种思想的具体实现。
  3. 依赖注入 DI，常见的两种方式：

  - set 注入（执行 set 方法给属性赋值）
  - 构造方法输入（执行构造方法给属性赋值）

  4. 依赖，注入分别是什么意思？

  - 依赖：A 对象和 B 对象的关系
  - 注入：一种手段，可以让 A 对象和 B 对象产生关系
  - 依赖注入： 对象 A 和对象 B 之间的关系，靠注入的手段来维护，而注入包括，set 注入和构造注入

- 专业术语
  1. OCP：开闭原则
  2. 依赖倒置原则
  3. IoC：控制反转
  4. 依赖注入（控制反转思想的具体实现）

## spring8 大模块

1. spring Core: 提供 IoC 容器的实现和支持
2. spring AOP: 实现面向切面编程的支持
3. spring Web MVC: 提供基于 MVC 架构的 Web 应用程序
4. spring WebFlux: 响应式 Web 开发模块，基于反应式编程模型处理 Web 请求
5. spring Web: Web 应用程序支持模块，提供与 Servlet API 等 Web 相关技术的集成
6. spring DAO: 提供对数据访问对象的支持
7. spring ORM: 为流行的 ORM 框架提供集成方案
8. spring Context: 提供应用程序上下文的创建和管理功能