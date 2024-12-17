## springmvc 执行流程源码分析

```js
// 前端控制器 springmvc最核心的类
public class DispatcherServlet extends FrameworkServlet {
  // 这个方法负责处理请求,一次请求, 调用一次Dispatcher方法
  protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    // 通过请求路径获取对应要执行的处理器
    // 实际上返回的处理器执行链对象 (所有的处理器和拦截器对象)
    HandlerExecutionChain mappedHandler = getHandler(request);

    // 根据处理器获取处理器适配器对象
    HandlerAdapter ha = getHandlerAdapter(mappedHandler.getHandler()); // handler就是controller

    // 执行该请求对应的所有拦截器中的 preHandle 方法
    if (!mappedHandler.applyPreHandle(request, response)) {
        return;
    }

    // 调用处理器方法 返回modelAndView对象
    // 在这里进行的数据绑定,实际上调用处理器方法之前要给处理器方法传参
    // 需要传参的话, 这个参数要经过一个复杂的数据绑定过程(将前端提交的表单转换成 pojo 对象)
    mv = ha.handle(request, response, mappedHandler.getHandler());

     // 执行该请求对应的所有拦截器中的 postHandle 方法
    mappedHandler.applyPostHandle(processedRequest, response, mv);

    // 处理分发结果(本质上就是响应浏览器)
    this.processDispatchResult(processedRequest, response, mappedHandler, mv, (Exception)dispatchException);
  }

  private void processDispatchResult(HttpServletRequest request, HttpServletResponse response, @Nullable HandlerExecutionChain mappedHandler, @Nullable ModelAndView mv, @Nullable Exception exception) throws Exception {
    // 渲染操作
    render(mv, request, response);
    // 执行该请求中的所对应的所有拦截器的 afterCompletion 方法
    mappedHandler.triggerAfterCompletion(request, response, (Exception)null);
  }

  protected void render(ModelAndView mv, HttpServletRequest request, HttpServletResponse response) throws Exception {
    // 通过视图解析器解析, 返回视图view对象
    View view = this.resolveViewName(viewName, mv.getModelInternal(), locale, request);
    // 调用视图对象的渲染方法(完成响应)
    view.render(mv.getModelInternal(), request, response);
  }

  protected View resolveViewName(String viewName, @Nullable Map<String, Object> model, Locale locale, HttpServletRequest request) throws Exception {
    // 视图解析器
    ViewResolver viewResolver;
    // 通过视图解析器解析返回视图对象 View
    View view = viewResolver.resolveViewName(viewName, locale);
  }
}

// 视图解析器接口
public interface ViewResolver {
  View resolveViewName(String viewName, Locale locale) throws Exception;
}

// 视图接口
public interface View {
  void render(@Nullable Map<String, ?> model, HttpServletRequest request, HttpServletResponse response) throws Exception;
}

// 每一个接口都有接口下的实现类, 例如view接口实现类:ThymeleafView InternalResourceView

```

## 根据请求获取处理器执行链

::: warning
springmvc 执行的第一步: <br>
通过处理器映射器找到请求路径对应的处理器方法 .
:::

分析这一行代码:

```js
HandlerExecutionChain mappedHandler = getHandler(request);
```

1. HandlerExecutionChain - 处理器执行链对象
2. HandlerExecutionChain 中的属性

```js
public class HandlerExecutionChain {
  // 底层对应的是一个 handlerMethod 对象
  private final Object handler; // MethodHandler
  // 该请求对应的所有拦截器按照顺序放到了ArrayList集合中
  // 所有的拦截器对象是在服务器启动时创建好的 .
  private final List<HandlerInterceptor> interceptorList;
}
```

3. handlerMethod 是什么 ?

   handlerMethod 是最核心的要执行的目标, 翻译为: 处理器方法. <br>
   注意:HandlerMethod 是在服务器启动时初始化 spring 容器的时候, 就已经创建好了. <br>
   这个类当中的重要的属性包括: beanName 和 method <br>
   例如下代码:

   ```js
    @Controller
    pulic class UserController() {
      @RequestMapping("/login")
      public String login(User user) {
        return ...
      }
    }
   ```

   那么以上代码对应了一个 HanlderMethod 对象 <br>

   ```js
    public class HanlderMethod {
      private String beanName = "userController";
      private Method loginMethod;
    }
   ```

4. getHandler(request);

```js
// 这个方法还是在 DispatcherServlet 类中
protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    if (this.handlerMappings != null) {
        Iterator var2 = this.handlerMappings.iterator();
        while(var2.hasNext()) {
            HandlerMapping mapping = (HandlerMapping)var2.next();
            // 通过合适的 HandlerMapping 才能获取到 HandlerExecutionChain 对象
            // 如果你处理器中使用了 @RequestMapping 注解, 那么以下代码中的mapping是: requestMappingHandlerMapping
            HandlerExecutionChain handler = mapping.getHandler(request);
            if (handler != null) {
                return handler;
            }
        }
    }

    return null;
}
```

重点: <br>
处理第一步调用的是 :HandlerExecutionChain mappedHandler = getHandler(request) <br>
其本质上调用的是: HandlerExecutionChain handler = mapping.getHandler(request);

HandlerMapping 是接口: <br>
是处理器映射器, 专门负责映射的, 就是根据请求路径映射处理器方法的. <br>
HandlerMapping 接口下有很多实现类: <br>
例如有名的且常用的: RequestMappingHandlerMapping <br>
这个 RequestMappingHandlerMapping 叫做: @RequestMapping 专用处理器映射器对象 <br>
如果不使用这个注解,就要进行 xml 文件进行配置, 就会使用其他的映射器处理器实现类 <br>
HandlerMapping 对象 是在服务器启动阶段进行创建的, 所有的 HandlerMapping 对象都是在服务器启动创建,并且存放在集合中. <br>

```js
public class DispatcherServlet {
  private List<HandlerMapping> handlerMappings;
}
```

5. requestMappingHandlerMapping 中的 getHandler(request)
   HandlerExecutionChain handler = mapping.getHandler(request); <br>

   mapping.getHandler(request) 方法一定是获取了 HandlerMethod 将其赋值给 HandlerExecutionChain 中的 handler 属性.

   ```js
    public class RequestMappingHandlerMapping extends AbstractHandlerMethodMapping {
      public void registerMapping(RequestMappingInfo mapping, Object handler, Method method) {
          super.registerMapping(mapping, handler, method);
          this.updateConsumesCondition(mapping, method);
      }
    }

    public class AbstractHandlerMethodMapping {
      public void registerMapping(T mapping, Object handler, Method method) {
        this.mappingRegistry.register(mapping, handler, method);
      }
      public void register(T mapping, Object handler, Method method) {
        HandlerMethod handlerMethod = createHandlerMethod(handler, method);
      }
      protected HandlerMethod createHandlerMethod(Object handler, Method method) {
        if (handler instanceof String beanName) {
            // 服务器启动时执行
            return new HandlerMethod(beanName, this.obtainApplicationContext().getAutowireCapableBeanFactory(), this.obtainApplicationContext(), method);
        } else {
            return new HandlerMethod(handler, method);
        }
      }
    }

   ```

   这一步牵连到的类: <br>

   - HandlerExecutionChain 处理器执行链
   - HanlderMethod - 处理器方法
   - HandlerInterceptor - list 中的拦截器
   - HandlerMapping
     - requestMappingHandlerMapping (HandlerMapping 接口的实现)

## DispatcherServlet 流程概述

用户发起请求, DispatcherServlet(前端控制器) 拦截到请求, 通过处理器映射器(handlerMapping),返回一个 handler 处理器(实质是一个 handlerExecutionChain), 根据返回的 handler, 来获取适合的 handlerAdapter 处理器适配器,下面进行 preHandler, 根据 handlerAdapter 来调用处理器方法(参数处理,绑定), 返回逻辑视图名称给到 处理器适配器, 然后处理器适配器根据逻辑视图名称, 返回 MV(modelAndView),给到前端控制器, 前端控制利用视图解析器 ViewResolver, 解析出视图对象 View, 返回给前端控制器, 接下来根据 View 视图解析对象,进行渲染,

### 服务器启动

1. 初始化 spring 上下文, 也就是创建所有的 Bean, 让 IOC 容器将其管理起来
2. 初始化 springMVC 相关的对象: 处理器映射器, 处理器适配器 等
