## springMVC

- 一个实现了 MVC 框架模式的 Web 框架，底层基于 Servlet 实现。

### 帮助我们做了什么 ？

1.  入口控制：SpringMVC 框架通过 DispatcherServlet 作为入口控制器，负责接收请求和分发请求。而在 Servlet 开发中，需要自己编写 Servlet 程序，并在 web.xml 中进行配置，才能接受和处理请求。
2.  在 SpringMVC 中，表单提交时可以自动将表单数据绑定到相应的 JavaBean 对象中，只需要在控制器方法的参数列表中声明该 JavaBean 对象即可，无需手动获取和赋值表单数据。而在纯粹的 Servlet 开发中，这些都是需要自己手动完成的。
3.  IoC 容器：SpringMVC 框架通过 IoC 容器管理对象，只需要在配置文件中进行相应的配置即可获取实例对象，而在 Servlet 开发中需要手动创建对象实例。
4.  统一处理请求：SpringMVC 框架提供了拦截器、异常处理器等统一处理请求的机制，并且可以灵活地配置这些处理器。而在 Servlet 开发中，需要自行编写过滤器、异常处理器等，增加了代码的复杂度和开发难度。
5.  视图解析：SpringMVC 框架提供了多种视图模板，如 JSP、Freemarker、Velocity 等，并且支持国际化、主题等特性。而在 Servlet 开发中需要手动处理视图层，增加了代码的复杂度。

### 第一个 Spring MVC 的开发流程

1. 创建一个空的工程
2. 设置 JDK 版本
3. 设置 maven 版本
4. 创建 maven 模块
5. 在 pom 文件设置打包方式 war 方式
6. 引入依赖
   springmvc 依赖
   logback 依赖
   thymeleaf 和 spring6 整合
   servlet 依赖（scope 设置 provided 表示这个依赖由第三方容器来提供）

### 1.2 给 Maven 模块添加 web 支持

在模块 src/main 目录下新建 webapp 目录 （默认是带有小蓝点 没有需要自己添加 module 设置 ）
另外需要添加 web.xml 文件 注意添加的路径

### 1.3 在 web.xml 文件中配置前端控制器（springmvc 内置的一个类 DispatchServlet）所有的请求都应该经过 DispatcherServlet 处理

重点：<url-pattern> / </url-pattern>
/ 表示 除了访问 xxx.jsp 结尾的请求路径外的所有路径
也就是说 只要不是 JSP 访问路径，一定会走 DispatcherServlet

### 1.4 编写 FirstController，在类上标注 @Controller 注解，纳入 IOC 容器

当然 也可以用 @Component 注解进行标注 @Controller 只是@Component 的别名

### 1.5 配置编写 Springmvc 框架自己的配置文件

配置文件默认的名字 <servlet-name />
配置文件默认存放的位置 WEB-INF
两个配置：
1 组件扫描
2 配置视图解析器

### 1.6 提供视图

在 WEB-INF/templates 目录下新建 first.html 文件
编写符合 html 模版的字符串

### 1.7 提供请求映射

最终返回逻辑视图名称
逻辑视图名称：first
物理视图名称：前缀 + first + 后缀
最终路径： /WEB-INF/templates/first.html
