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

### 关于@RequestMapping 注解的 value 属性

value 属性本身是一个 String[] 字符串数组，说明多个请求可以映射同一个处理器方法 <br />
如果注解的属性是数组，并且在使用注解的时候，该数组只有一个元素，大括号可以省略 <br />
如果使用某个注解的时候，如果只使用一个 value 属性，那么 value 也是可以省略的 <br />
value 属性的别名是 path <br />
path 属性的别名是 value

### RequestMapping 的 value 属性支持 Ant 风格的 支持模糊匹配的路径

? 表示任意一个字符

- 表示 0 到 N 个任意字符 (排除'/' '?')
  ** 表示 0 到 N 个任意字符 ，可以出现路径分隔符 注意 ** 左边只能 '/'
  spring6 只能是末尾出现

### 关于@RequestMapping 注解的 value 属性占位符（重点）

现在流行 RESTFUL 风格的 URL：/springmvc/login/admin/123

```js
@RequestMapping("/login/{username}/{password}")
public String testRESTFulURL(
       @PathVariable("username")
       String username,
       @PathVariable("password")
       String password) {
   System.out.println("username: " + username + " password: " + password);
   return  "ok";
}
```

### 关于@RequestMapping 注解的 method 属性，通过该属性限制前端请求方式，如果请求方式不同，则会报 405 错误

```js
@RequestMapping(value = "/user/login", method = { RequestMethod.GET, RequestMethod.POST })
public String userLogin() {
   System.out.println("处理登陆的业务逻辑...");
   return "ok";
}
```

### 衍生 Mapping

- @PostMapping
- @GetMapping

### web 的请求方式

GET POST PUT DELETE HEAD

### 关于 requestMapping 注解的 params 属性

### 关于 requestMapping 注解的 headers 属性

### 获取请求的数据

1. servlet API

在处理器方法参数上，HttpServletRequest
springMvc 框架将自动将 Tomcat 服务器创建的 request 对象传递给处理器方法
我们直接在方法中使用 equest 对象即可。

2. 注解 @requestParam

属性 value name
required：设置该参数是否必传，如果该属性没传则提示 400
这个属性类似于 @RequestMapping 注解中的 params
可以设置为 false，则该参数不是必传 不会报 400，但是前端没有提供这个属性，默认为 null
defaultValue：如果前端没有提供参数，可以设置该参数的默认值

3. 行参名来接收，如果方法行参的名字和提交数据时的 name 相同，则@RequestParam 可省略

```js
如果使用的是spring6+版本，则需要在pom文件上添加如下：
<build>
   <plugins>
       <plugin>
           <groupId>org.apache.maven.plugins</groupId>
           <artifactId>maven-compiler-plugin</artifactId>
           <version>3.13.0</version>
           <configuration>
               <source>17</source>
               <target>17</target>
               <compilerArgs>
                   <arg>-parameters</arg>
               </compilerArgs>
           </configuration>
       </plugin>
   </plugins>
</build>

注意：如果 控制器上的行参名 和 请求参数名 不一致，那么控制器上的行参默认值是 null
```

4. 使用 POJO 类/JavaBean 接收请求参数（常用）

底层实现：反射机制
不过使用前提是：POJO 类的属性名和请求参数名一致
实现原理是什么？
假设提交一个请求，参数名是 username，那么 POJO 类必须有一个属性名也叫作：username
根据 username 进行 setUsername 注入赋值

重点：底层通过反射机制调用 set 方法给属性赋值，所以 set 方法名非常重要。
如果前端提交参数是 username，那么 POJO 类中必须有 seUsername 方法

### 获取请求头信息 ？

```js
使用@RequestHeader注解获取
@RequestHeader(value = "Referer",required = false, defaultValue = "")
```

### 获取客户端提交的 Cookie ？

使用@CookieValue 注解 获取控制器方法上的行参

### 关于 javaweb 项目，如何解决 post 请求乱码问题？

request.setCharacterEncoding("utf-8");
但是该执行语句必须在 request.getParameter("")之前执行才有效。
第一种：可以自己写 过滤器 Filter
第二种：使用 springmvc 内置的字符编码过滤器 CharacterEncodingFilter

### Request 域数据共享

- 第一种方式：在处理器方法上，添加 HttpServletRequest 参数即可
- 第二种方式：在 springmvc 的处理器方法上添加一个接口类型 Model （ui.Model）

```js
@RequestMapping("/testModel")
public String testModel(Model model) {
    model.addAttribute("testRequest", "testModel");'
    // 转发
    return "ok";
}
```

- 第三种方式：在 springmvc 的处理器方法上添加一个接口类型 Map

```js
@RequestMapping("/testMap")
public String testMap(Map<String, Object> map) {
   map.put("testRequest", "testMap");
   return "ok";
}
```

- 第四种方式：在 springmvc 的处理器方法上添加一个类 ModelMap

```js
@RequestMapping("/testModelMap")
public String testModelMap(ModelMap modelMap) {
   modelMap.addAttribute("testRequest", "testModelMap");
   return "ok";
}
```

研究下，Model 接口，Map 接口，ModelMap 类 三者之间的关系 ？<br/>
::: warning
表面是使用的不同接口和不同的类，实际上使用的是同一个对象 org.springframework.validation.support.BindingAwareModelMap
:::

- 第五种方式: 使用 ModelAndView 类完成数据共享

```js
@RequestMapping("/testModelAndView")
public ModelAndView testModelAndView() {
    // 创建模型视图对象
    ModelAndView modelAndView = new ModelAndView();
    // 给模型视图对象 绑定数据
    modelAndView.addObject("testRequest", "testModelAndView");
    // 给模型视图对象 绑定 视图
    modelAndView.setViewName("ok");
    // 返回模型视图对象
    return modelAndView;
}
```

聊一个真相:

::: warning
对于处理器方法来说,不管使用的是 Model 对象,Map 对象, modelMap 类, ModelAndView 类,最终处理器方法执行
结束后,返回的都是 ModelAndView 对象,这个返回的 ModelAndView 对象给 DispatchServlet 类了 <br/>

当请求路径不是 JSP 的时候,都会走前端控制器 DispatchServlet.
DispatchServlet 中有一个方法 doDispatch,这个方法通过请求路径找到 处理器方法,
然后调用处理器方法返回一个视图名称(也可能是一个 ModelAndView 对象),底层会将逻辑视图名称转换
为 view 对象,然后结合 Model 对象,封装一个 ModelAndView 对象,然后将该对象返回给 DispatchServlet 类.

:::

### Session 域数据存储

- 第一种方式: 使用原生的 servlet API 实现(在处理器方法的参数上添加 httpSession 对象, springMVC 会自动将 session 对象传递给这个参数)
- 第二种方式: 使用@SessionAttributes 注解实现 session 域数据存储

### Application 域数据存储

这个域使用较少,如果使用的话,一般采用 Servlet API 的方式使用.

```js
@RequestMapping("/testApplication")
public String testApplicaitonScope(HttpServletRequest request) {
    ServletContext application = request.getServletContext();
    application.setAttribute("testApplication", "testApplication");
    return "ok";
}
```

### SpringMVC 中常用的视图

- InternalResourceView: 内部资源视图 (是- springMVC 内置的,专门用于解析 JSP 模版语法的, 另外也负责 转发 forward 功能实现)
- RedirectView: 重定向视图 (是 springMVC 内置的, 专门负责 重定向 redirect 功能实现)
- ThymeleafView: Thymeleaf 视图 (第三方, 专门负责解析 thymeleaf 模版语法)
  ...

### 实现视图的核心类和核心接口

1. DispatcherServlet: 前端控制器
   负责接收前端的请求
   根据请求路径找到对应的处理器方法
   执行处理器方法
   并且最终返回 ModelAndView 对象.
   再往下就是视图解析器
2. ViewSource 接口: 视图解析器接口 (ThymeleafViewResolver 实现了 ViewSource 接口, InternalResourceView 也是实现了 ViewSource 接口)
   这个接口做什么 ?
   这个接口的作用就是将 逻辑视图名称 转换为 物理视图名称
   并且最终返回一个 View 接口对象
   核心方法是什么 ?
   View resolveViewName(String viewName, Locale locale) throws Exception;
3. View 接口: 视图接口
   这个接口做什么 ?
   这个接口主要负责将模版语法的字符串转换为 html 代码, 并且将 html 代码响应给浏览器 (即渲染.)
   核心方法是什么 ?
   void render(@Nullable Map<String, ?> model, HttpServletRequest request, HttpServletResponse response) throws Exception;

### 在 springMVC 中是怎么实现转发的 ?

```js
@RequestMapping("/A")
public String toA() {
    // 返回逻辑视图
    return "pageA";
}
/* 注意:
当 return pageA 的时候, 返回一个逻辑视图,这种方式跳转到视图
默认采用的是forward方式跳转过去的, 只不过这个底层创建的视图对象 是thymeleafView
*/
```

- 怎么转发 ? 什么格式 ?
  "return forward: /B" 转发到 /B ,这是一次请求, 底层创建视图对象是, internalResourceView 对象
- 怎么重定向 ? 什么格式 ?
  "return redirect: /B" 转发到 /B ,发起两次请求,底层创建的是 RedirectView

:::warning
总结: <br/>
转发: "return forward: /B" ---> internalResourceView <br/>
重定向: "return redirect: /B" ---> redirectView
:::

### <mvc:view-controller>

:::info
这是个配置信息, 可以在 springmvc.xml 文件中进行配置, 作用是什么 ?
如果一个 Controller 上的方法是为了完成视图跳转,没有任何业务代码,那么这个 controller 可以不写.
直接在 springmvc.xml 中写上 <mvc:view-controller /> 注解即可.

<!--配置视图控制器-->

<mvc:view-controller path="/test" view-name="test" />
:::

### <mvc:annotation-driven />

开启注解启动,会让整个项目中的注解再次开启.

### 关于静态资源处理.

- 假如有静态文件 static,如果想要直接访问有两种解决方式:
  1. 第一种: 开启默认的 Servlet 服务, 需要在 springmvc.xml 配置 开启静态资源访问
     ```js
     <!--开启默认的defaultServlet 可以使用default访问静态资源-->
     <mvc:default-servlet-handler />
     <mvc:annotation-driven />
     ```
     Servlet 服务器默认先走 DispatcherServlet ,如果发生 404, 则会自动走 defaultServlet 服务帮你定位静态资源.
  2. 在 springmvc.xml 文件中 添加如下配置:
  ```js
  <!--配置处理静态资源-->
  <mvc:annotation-driven />
  <mvc:resources mapping="/static/**" location="/static/" />
  ```

## RESTful API

### 什么是 RESTful ?

RESTful 是对 WEB 服务接口的设计风格,提供的一套约束,可以让 WEB 服务接口更加简洁, 易于理解. <br>
RESTful 是表述性状态转移

- 查询 get
- 新增 post
- 删除 delete
- 修改 put

### RESTful 风格中要求,修改的时候,提交必须是一个 PUT 请求, 怎么提交 PUT 请求 ?

1. 要想发送 put 请求, 前提必须是一个 POST 请求
2. 在 POST 请求中添加隐藏域:
   <input type="hidden" name="_method" value="put" />

3. 在 web.xml 中添加一个过滤器

```js
<filter>
   <filter-name>hiddenHttpMethodFilter</filter-name>
   <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
</filter>
<filter-mapping>
   <filter-name>hiddenHttpMethodFilter</filter-name>
   <url-pattern>/*</url-pattern>
</filter-mapping>
```
