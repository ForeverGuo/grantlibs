## 数据驱动

<span :class="$style.common_text">Vue.js</span> 一个核心思想是数据驱动。所谓数据驱动，是指视图是由数据驱动生成的，我们对视图的修改，不会直接操作 DOM，而是通过修改数据。它相比我
们传统的前端开发，如使用 jQuery 等前端库直接修改 DOM，大大简化了代码
量。特别是当交互复杂的时候，只关心数据的修改会让代码的逻辑变的非常清
晰，因为 DOM 变成了数据的映射，我们所有的逻辑都是对数据的修改，而不
用碰触 DOM，这样的代码非常利于维护。<br><br>

在 Vue.js 中我们可以采用简洁的模板语法来声明式的将数据渲染为 DOM：

```js
<div id="app">{{ message }}</div>;
var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
  },
});
```

## new Vue 发生了什么

<br>
我们知道 <span :class="$style.red_text">new</span> 关键字在 Javascript 语言中代表实例化是一个对象，而 Vue 实际上是一个类，类在 Javascript 中是用 Function 来实现的，来看一下源码，在
src/core/instance/index.js 中。

```js
function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}
```

可以看到 <span :class="$style.red_text">Vue</span> 只能通过 new 关键字初始化，然后会调用 this.\_init 方法， 该方
法在 src/core/instance/init.js 中定义。

```js
// 负责 Vue 的初始化过程
Vue.prototype._init = function (options?: Object) {
  // vue 实例
  const vm: Component = this;
  // 每个 vue 实例都有一个 _uid，并且是依次递增的
  vm._uid = uid++;

  let startTag, endTag;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    startTag = `vue-perf-start:${vm._uid}`;
    endTag = `vue-perf-end:${vm._uid}`;
    mark(startTag);
  }

  // a flag to avoid this being observed
  vm._isVue = true;
  // 处理组件配置项
  if (options && options._isComponent) {
    /**
     * 每个子组件初始化时走这里，这里只做了性能优化，将组件配置对象上的一些深层次属性放到 vm.$options 选项中，以提高代码执行效率
     * 至于每个子组件的选项合并发生在两个地方：
     *   1、Vue.component 方法注册的全局组件在注册时做了选项合并
     *   2、{ components: { xxx } } 方式注册的局部组件在执行编译器生成的 render 函数时做了选项合并，包括根组件中的 components 配置
     */
    initInternalComponent(vm, options);
  } else {
    // 初始化根组件时走这里，合并 Vue 的全局配置到根组件的局部配置，比如 Vue.component 注册的全局组件最后会合并到 根组件实例的 components 选项中
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    );
  }
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== "production") {
    // 设置代理，将 vm 实例上的属性代理到 vm._renderProxy
    initProxy(vm);
  } else {
    vm._renderProxy = vm;
  }
  // expose real self
  vm._self = vm;
  // 初始化组件实例关系属性，比如 $parent、$children、$root、$refs 等
  initLifecycle(vm);
  /**
   * 初始化自定义事件，这里需要注意一点，所以我们在 <comp @click="handleClick" /> 上注册的事件，监听者不是父组件，
   * 而是子组件本身，也就是说事件的派发和监听者都是子组件本身，和父组件无关
   */
  initEvents(vm);
  // 解析组件的插槽信息，得到 vm.$slot，处理渲染函数，得到 vm.$createElement 方法，即 h 函数
  initRender(vm);
  // 调用 beforeCreate 钩子函数
  callHook(vm, "beforeCreate");
  // 初始化组件的 inject 配置项，得到 result[key] = val 形式的配置对象，然后对结果数据进行浅层的响应式处理（只处理了对象的第一层数据），并代理每个 key 到 vm 实例
  initInjections(vm); // resolve injections before data/props
  // 数据响应式的重点，处理 props、methods、data、computed、watch
  initState(vm);
  // 解析组件配置项上的 provide 对象，将其挂载到 vm._provided 属性上
  initProvide(vm); // resolve provide after data/props
  // 调用 created 钩子函数
  callHook(vm, "created");

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    vm._name = formatComponentName(vm, false);
    mark(endTag);
    measure(`vue ${vm._name} init`, startTag, endTag);
  }

  // 如果发现配置项上有 el 选项，则自动调用 $mount 方法，也就是说有了 el 选项，就不需要再手动调用 $mount，反之，没有 el 则必须手动调用 $mount
  if (vm.$options.el) {
    // 调用 $mount 方法，进入挂载阶段
    vm.$mount(vm.$options.el);
  }
};
```

> [!TIP]
> Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中
> 心，初始化渲染，初始化 data、props、computed、watcher 等等。

## Vue 实例挂载的实现

Vue 中是通过<span :class="$style.red_text"> $mount </span> 实例方法去挂载 vm 的，$mount 方法在多个文件中
都有定义，如 src/platform/web/entry-runtime-with-compiler.js、src/platform/web/runtime/index.js、src/platform/weex/runtime/index.js。因为 $mount 这个方
法的实现是和平台、构建方式都相关的。接下来我们重点分析带 compiler 版
本的 $monut 实现，因为抛开 webpack 的 vue-loader，我们在纯前端浏览器
环境分析 Vue 的工作原理，有助于对原理理解的深入。<br>

<span :class="$style.red_text">compiler</span> 版本的 <span :class="$style.red_text">$monut</span> 实现非常有意思，先来看一下 src/platform/web/entry-runtime-with-compiler.js 文件中定义：

```js
/**
 * 编译器的入口
 * 运行时的 Vue.js 包就没有这部分的代码，通过 打包器 结合 vue-loader + vue-compiler-utils 进行预编译，将模版编译成 render 函数
 *
 * 就做了一件事情，得到组件的渲染函数，将其设置到 this.$options 上
 */
const mount = Vue.prototype.$mount; // 这里是暂存原型的$mount 方法

// 重写$mount方法的实质是判断是否提供render函数，若没有 则进入模版编译 -> render 函数生成
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 挂载点
  el = el && query(el);

  // 挂载点不能是 body 或者 html
  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  // 配置项
  const options = this.$options;
  // resolve template/el and convert to render function
  /**
   * 如果用户提供了 render 配置项，则直接跳过编译阶段，否则进入编译阶段
   *   解析 template 和 el，并转换为 render 函数
   *   优先级：render > template > el
   */
  if (!options.render) {
    let template = options.template;
    if (template) {
      // 处理 template 选项
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          // template: '#app'，template 是一个 id 选择器，则获取该元素的 innerHtml 作为模版
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        // template 是一个正常的元素，获取其 innerHtml 作为模版
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      // 设置了 el 选项，获取 el 选择器的 outerHtml 作为模版
      template = getOuterHTML(el);
    }
    if (template) {
      // 模版就绪，进入编译阶段
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      // 编译模版，得到 动态渲染函数和静态渲染函数
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          // 在非生产环境下，编译时记录标签属性在模版字符串中开始和结束的位置索引
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          // 界定符，默认 {{}}
          delimiters: options.delimiters,
          // 是否保留注释
          comments: options.comments,
        },
        this
      );
      // 将两个渲染函数放到 this.$options 上
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  // 执行挂载
  return mount.call(this, el, hydrating);
};
```

这段代码首先缓存了原型上的 <span :class="$style.red_text">$mount</span> 方法，再重新定义该方法，我们先来分
析这段代码。首先，它对 el 做了限制，Vue 不能挂载在<span :class="$style.red_text"> body、html </span>这样的
根节点上。接下来的是很关键的逻辑 —— 如果没有定义 render 方法，则会
把 el 或者 template 字符串转换成 <span :class="$style.red_text">render</span> 方法。这里我们要牢记，在 Vue
2.0 版本中，所有 Vue 的组件的渲染最终都需要 render 方法，无论我们是用
单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换
成 render 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调
用 compileToFunctions 方法实现的。最后调用原先原型上的 $mount 方法挂载。
<br>
原先原型上的 <span :class="$style.red_text">$mount</span> 方法在 src/platform/web/runtime/index.js 中定义，之所
以这么设计完全是为了复用，因为它是可以被 runtime only 版本的 Vue 直接
使用的。

```js
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined;
  // 这里执行beforeMount mounted
  return mountComponent(this, el, hydrating);
};
```

<span :class="$style.red_text">$mount</span> 方法支持传入 2 个参数，第一个是 <span :class="$style.red_text">el</span>，它表示挂载的元素，可以是字
符串，也可以是 DOM 对象，如果是字符串在浏览器环境下会调用 query 方法
转换成 DOM 对象的。第二个参数是和<span :class="$style.red_text">服务端渲染</span>相关，在浏览器环境下我们不需要传第二个参数。
<br>
$mount 方法实际上会去调用 mountComponent 方法，这个方法定义在 src/
core/instance/lifecycle.js 文件中：

```js
/**
 * 真正执行挂载的地方
 * @param {*} vm
 * @param {*} el
 * @param {*} hydrating
 * @returns
 */
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el;
  /**
   * vm.$options.render 有两种来源：
   *   编译器将模版编译为 render 函数
   *     带编译器的 vue，则在运行时编译模版为 render 函数，即 $mount 的第一步
   *     不带编译器的 vue，则由 vue-loader + vue-template-compiler 完成预编译，到运行时 vm.$options 上已经存在 render 了
   *   用户手动编写 render 函数
   */
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== "production") {
      /* istanbul ignore if */
      if (
        (vm.$options.template && vm.$options.template.charAt(0) !== "#") ||
        vm.$options.el ||
        el
      ) {
        warn(
          "You are using the runtime-only build of Vue where the template " +
            "compiler is not available. Either pre-compile the templates into " +
            "render functions, or use the compiler-included build.",
          vm
        );
      } else {
        warn(
          "Failed to mount component: template or render function not defined.",
          vm
        );
      }
    }
  }
  // 调用 beforeMount 钩子函数
  callHook(vm, "beforeMount");

  /**
   * 定义 updateComponent 方法，该方法在两个时间点会被调用
   *   1、初始化 watcher 时会被自动执行一次
   *   2、响应式数据更新时由 watcher 的 run 方法调用
   */
  let updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name;
      const id = vm._uid;
      const startTag = `vue-perf-start:${id}`;
      const endTag = `vue-perf-end:${id}`;

      mark(startTag);
      const vnode = vm._render();
      mark(endTag);
      measure(`vue ${name} render`, startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(`vue ${name} patch`, startTag, endTag);
    };
  } else {
    updateComponent = () => {
      // 执行 vm._render() 函数，得到 虚拟 DOM，并将 vnode 传递给 _update 方法，接下来就该到 patch 阶段了
      vm._update(vm._render(), hydrating);
    };
  }

  // 实例化 组件 watcher
  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // 调用 mounted 钩子函数
  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, "mounted");
  }
  return vm;
}
```

从上面的代码可以看到，mountComponent 核心就是先调用<span :class="$style.red_text"> vm.\_render </span> 方法先生
成虚拟 Node，再实例化一个渲染<span :class="$style.red_text"> Watcher </span>在它的回调函数中会调
用 updateComponent 方法，最终调用 <span :class="$style.red_text"> vm.\_update </span>更新 DOM。
<br>
<span :class="$style.red_text">Watcher</span> 在这里起到两个作用，一个是初始化的时候会执行回调函数，另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数。
<br>
函数最后判断为根节点的时候设置<span :class="$style.red_text"> vm.\_isMounted</span> 为 true， 表示这个实例已
经挂载了，同时执行 mounted 钩子函数。 这里注意 <span :class="$style.red_text">vm.$vnode</span> 表示 Vue 实例的父虚拟 Node，所以它为<span :class="$style.red_text"> Null </span> 则表示当前是根 Vue 的实例。

## render 解析

<br>
Vue 的 <span :class="$style.red_text">_render</span> 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟
Node。它的定义在 <span :class="$style.red_text">src/core/instance/render.js</span> 文件中：

```js
/**
 * 通过执行 render 函数生成 VNode
 * 不过里面加了大量的异常处理代码
 */
Vue.prototype._render = function (): VNode {
  const vm: Component = this;
  const { render, _parentVnode } = vm.$options;

  if (_parentVnode) {
    vm.$scopedSlots = normalizeScopedSlots(
      _parentVnode.data.scopedSlots,
      vm.$slots,
      vm.$scopedSlots
    );
  }

  // 设置父 vnode。这使得渲染函数可以访问占位符节点上的数据。
  vm.$vnode = _parentVnode;
  // render self
  let vnode;
  try {
    currentRenderingInstance = vm;
    // 执行 render 函数，生成 vnode
    vnode = render.call(vm._renderProxy, vm.$createElement);
  } catch (e) {
    handleError(e, vm, `render`);
    // 到这儿，说明执行 render 函数时出错了
    // 开发环境渲染错误信息，生产环境返回之前的 vnode，以防止渲染错误导致组件空白
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production" && vm.$options.renderError) {
      try {
        vnode = vm.$options.renderError.call(
          vm._renderProxy,
          vm.$createElement,
          e
        );
      } catch (e) {
        handleError(e, vm, `renderError`);
        vnode = vm._vnode;
      }
    } else {
      vnode = vm._vnode;
    }
  } finally {
    currentRenderingInstance = null;
  }
  // 如果返回的 vnode 是数组，并且只包含了一个元素，则直接打平
  if (Array.isArray(vnode) && vnode.length === 1) {
    vnode = vnode[0];
  }
  // render 函数出错时，返回一个空的 vnode
  if (!(vnode instanceof VNode)) {
    if (process.env.NODE_ENV !== "production" && Array.isArray(vnode)) {
      warn(
        "Multiple root nodes returned from render function. Render function " +
          "should return a single root node.",
        vm
      );
    }
    vnode = createEmptyVNode();
  }
  // set parent
  vnode.parent = _parentVnode;
  return vnode;
};
```

这段代码最关键的是 render 方法的调用，我们在平时的开发工作中手写 render 方法的场景比较少，而写的比较多的是 template 模板，在之前的 mounted 方法的实现中，会把 template 编译成 render 方法。
<br>
在 Vue 的官方文档中介绍了 render 函数的第一个参数是 createElement，那
么结合之前的例子：

```js
<div id="app">{{ message }}</div>

// 等同于

render: function (createElement) {
  return createElement('div',
    {
      attrs: {
        id: 'app'
      },
    },
    this.message
   )
}
```

render 函数中的 createElement 方法就是 vm.$createElement 方法：

```js
export function initRender(vm: Component) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  const options = vm.$options;
  const parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  /**
   * 定义 _c，它是 createElement 的一个柯里化方法
   * @param {*} a 标签名
   * @param {*} b 属性的 JSON 字符串
   * @param {*} c 子节点数组
   * @param {*} d 节点的规范化类型
   * @returns VNode or Array<VNode>
   */
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
}
```

实际上，<span :class="$style.red_text">vm.$createElement</span> 方法定义是在执行 <span :class="$style.red_text">initRender</span> 方法的时候，可以看到除了 vm.$createElement 方法，还有一个 vm._c 方法，它是被模板编译成的render 函数使用，而 <span :class="$style.red_text">vm.$createElement</span>是用户手写 <span :class="$style.red_text">render</span> 方法使用的， 这俩个方法支持的参数相同，并且内部都调用了<span :class="$style.red_text"> createElement </span>方法。

## Virtual DOM

![Virtual Dom](image.png)
<br>
<span :class="$style.red_text">Virtual DOM</span> 就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多。在 Vue.js 中，Virtual DOM 是用 VNode 这
么一个 Class 去描述，它是定义在 <span :class="$style.red_text">src/core/vdom/vnode.js</span> 中的。

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child(): Component | void {
    return this.componentInstance;
  }
}
```

可以看到 Vue.js 中的 <span :class="$style.common_text">Virtual DOM </span> 的定义还是略微复杂一些的，因为它这里包含了很多 Vue.js 的特性。这里千万不要被这些茫茫多的属性吓到，实际上 Vue.js 中 Virtual DOM 是借鉴了一个开源库<span :class="$style.common_text"> snabbdom </span>的实现，然后加入了
一些 Vue.js 特色的东西。

## CreateElement

<br>
Vue.js 利用 createElement 方法创建 VNode，它定义
在<span :class="$style.red_text"> src/core/vdom/create-elemenet.js </span>中：

```js
/**
 * 生成组件或普通标签的 vnode，一个包装函数，不用管
 * wrapper function for providing a more flexible interface
 * without getting yelled at by flow
 */
export function createElement(
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  // 执行 _createElement 方法创建组件的 VNode
  return _createElement(context, tag, data, children, normalizationType);
}
```

createElement 方法实际上是对<span :class="$style.red_text">\_createElement</span> 方法的封装，它允许传入的参数
更加灵活，在处理这些参数后，调用真正创建 VNode 的函
数 <span :class="$style.red_text">\_createElement</span>：

```js
/**
 * 生成 vnode，
 *   1、平台保留标签和未知元素执行 new Vnode() 生成 vnode
 *   2、组件执行 createComponent 生成 vnode
 *     2.1 函数式组件执行自己的 render 函数生成 VNode
 *     2.2 普通组件则实例化一个 VNode，并且在其 data.hook 对象上设置 4 个方法，在组件的 patch 阶段会被调用，
 *         从而进入子组件的实例化、挂载阶段，直至完成渲染
 * @param {*} context 上下文
 * @param {*} tag 标签
 * @param {*} data 属性 JSON 字符串
 * @param {*} children 子节点数组
 * @param {*} normalizationType 节点规范化类型
 * @returns VNode or Array<VNode>
 */
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    // 属性不能是一个响应式对象
    process.env.NODE_ENV !== "production" &&
      warn(
        `Avoid using observed data object as vnode data: ${JSON.stringify(
          data
        )}\n` + "Always create fresh vnode data objects in each render!",
        context
      );
    // 如果属性是一个响应式对象，则返回一个空节点的 VNode
    return createEmptyVNode();
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // 动态组件的 is 属性是一个假值时 tag 为 false，则返回一个空节点的 VNode
    // in case of component :is set to falsy value
    return createEmptyVNode();
  }
  // 检测唯一键 key，只能是字符串或者数字
  // warn against non-primitive key
  if (
    process.env.NODE_ENV !== "production" &&
    isDef(data) &&
    isDef(data.key) &&
    !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !("@binding" in data.key)) {
      warn(
        "Avoid using non-primitive value as key, " +
          "use string/number value instead.",
        context
      );
    }
  }

  // 子节点数组中只有一个函数时，将它当作默认插槽，然后清空子节点列表
  // support single function children as default scoped slot
  if (Array.isArray(children) && typeof children[0] === "function") {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  // 将子元素进行标准化处理
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }

  /**
   * 这里开始才是重点，前面的都不需要关注，基本上是一些异常处理或者优化等
   */

  let vnode, ns;
  if (typeof tag === "string") {
    // 标签是字符串时，该标签有三种可能：
    //   1、平台保留标签
    //   2、自定义组件
    //   3、不知名标签
    let Ctor;
    // 命名空间
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // tag 是平台原生标签
      // platform built-in elements
      if (
        process.env.NODE_ENV !== "production" &&
        isDef(data) &&
        isDef(data.nativeOn)
      ) {
        // v-on 指令的 .native 只在组件上生效
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        );
      }
      // 实例化一个 VNode
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      );
    } else if (
      (!data || !data.pre) &&
      isDef((Ctor = resolveAsset(context.$options, "components", tag)))
    ) {
      // tag 是一个自定义组件
      // 在 this.$options.components 对象中找到指定标签名称的组件构造函数
      // 创建组件的 VNode，函数式组件直接执行其 render 函数生成 VNode，
      // 普通组件则实例化一个 VNode，并且在其 data.hook 对象上设置了 4 个方法，在组件的 patch 阶段会被调用，
      // 从而进入子组件的实例化、挂载阶段，直至完成渲染
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // 不知名的一个标签，但也生成 VNode，因为考虑到在运行时可能会给一个合适的名字空间
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // tag 为非字符串，比如可能是一个组件的配置对象或者是一个组件的构造函数
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  // 返回组件的 VNode
  if (Array.isArray(vnode)) {
    return vnode;
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns);
    if (isDef(data)) registerDeepBindings(data);
    return vnode;
  } else {
    return createEmptyVNode();
  }
}
```

\_createElement 方法有 5 个参数，<span :class="$style.common_text">context</span> 表示 VNode 的上下文环境，它
是 Component 类型；<span :class="$style.common_text">tag</span> 表示标签，它可以是一个字符串，也可以是一个 Comp
onent；<span :class="$style.common_text">data</span> 表示 VNode 的数据，它是一个 VNodeData 类型,<span :class="$style.common_text">children</span> 表示当前
VNode 的子节点，它是任意类型的，它接下来需要被规范为标准的 VNode 数
组；<span :class="$style.common_text">normalizationType</span> 表示子节点规范的类型，类型不同规范的方法也就不一
样，它主要是参考 render 函数是编译生成的还是用户手写的。<br>

由于 Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子
节点，这些子节点应该也是 VNode 的类型。\_createElement 接收的第 4 个参数
children 是任意类型的，因此需要把它们规范成 VNode 类型。<br>
这里根据 <span :class="$style.red_text">normalizationType</span> 的不同，调用了 <span :class="$style.red_text">normalizeChildren(children)</span> 和 <span :class="$style.red_text">simpleNormalizeChildren(children)</span> 方法，它们的定义都在 src/core/vdom/
helpers/normalzie-children.js 中：

```js
// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
export function simpleNormalizeChildren(children: any) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }
  return children;
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
export function normalizeChildren(children: any): ?Array<VNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
    ? normalizeArrayChildren(children)
    : undefined;
}
```

<span :class="$style.red_text">simpleNormalizeChildren</span> 方法调用场景是 render 函数当函数是编译生成的。理
论上编译生成的 children 都已经是 VNode 类型的，但这里有一个例外，就
是 <span :class="$style.red_text">functional component</span> 函数式组件返回的是一个数组而不是一个根节点，所
以会通过 Array.prototype.concat 方法把整个 children 数组打平，让它的深
度只有一层。<br>
<span :class="$style.red_text">normalizeChildren</span> 方法的调用场景有 2 种，一个场景是 render 函数是用户手
写的，当 children 只有一个节点的时候，Vue.js 从接口层面允许用户
把 children 写成基础类型用来创建单个简单的文本节点，这种情况会调用 c
reateTextVNode 创建一个文本节点的 VNode；另一个场景是当编译 slot、v-
for 的时候会产生嵌套数组的情况，会调用 normalizeArrayChildren 方法，接下
来看一下它的实现：

```js
function normalizeArrayChildren(
  children: any,
  nestedIndex?: string
): Array<VNode> {
  const res = [];
  let i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === "boolean") continue;
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, `${nestedIndex || ""}_${i}`);
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]: any).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== "") {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (
          isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)
        ) {
          c.key = `__vlist${nestedIndex}_${i}__`;
        }
        res.push(c);
      }
    }
  }
  return res;
}
```

<span :class="$style.red_text">normalizeArrayChildren</span> 接收 2 个参数，children 表示要规范的子节点，nestedIndex 表示嵌套的索引，因为单个 child 可能是一个数组类型。 normalizeArrayChildren 主要的逻辑就是遍历 children，获得单个节点 c，然后对 c 的类型判断，如果是一个数组类型，则递归调用 normalizeArrayChildren; 如果是基础类型，则通过 createTextVNode 方法转换成 VNode 类型；否则就已经是 VNode 类型了，如果 children 是一个列表并且列表还存在嵌套的情况，则根据 nestedIndex 去更新它的 key。这里需要注意一点，在遍历的过程中，对这 3 种情况都做了如下处理：如果存在两个连续的 text 节点，会把它们合并
成一个 text 节点。

### VNode 的创建

<br>
<span :class="$style.red_text">createElement</span> 函数，规范化 children 后，接下来会去创建一个 VNode的实例：

```js
let vnode, ns;
if (typeof tag === "string") {
  // 标签是字符串时，该标签有三种可能：
  //   1、平台保留标签
  //   2、自定义组件
  //   3、不知名标签
  let Ctor;
  // 命名空间
  ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
  if (config.isReservedTag(tag)) {
    // tag 是平台原生标签
    // platform built-in elements
    if (
      process.env.NODE_ENV !== "production" &&
      isDef(data) &&
      isDef(data.nativeOn)
    ) {
      // v-on 指令的 .native 只在组件上生效
      warn(
        `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
        context
      );
    }
    // 实例化一个 VNode
    vnode = new VNode(
      config.parsePlatformTagName(tag),
      data,
      children,
      undefined,
      undefined,
      context
    );
  } else if (
    (!data || !data.pre) &&
    isDef((Ctor = resolveAsset(context.$options, "components", tag)))
  ) {
    // tag 是一个自定义组件
    // 在 this.$options.components 对象中找到指定标签名称的组件构造函数
    // 创建组件的 VNode，函数式组件直接执行其 render 函数生成 VNode，
    // 普通组件则实例化一个 VNode，并且在其 data.hook 对象上设置了 4 个方法，在组件的 patch 阶段会被调用，
    // 从而进入子组件的实例化、挂载阶段，直至完成渲染
    // component
    vnode = createComponent(Ctor, data, context, children, tag);
  } else {
    // 不知名的一个标签，但也生成 VNode，因为考虑到在运行时可能会给一个合适的名字空间
    // unknown or unlisted namespaced elements
    // check at runtime because it may get assigned a namespace when its
    // parent normalizes children
    vnode = new VNode(tag, data, children, undefined, undefined, context);
  }
} else {
  // tag 为非字符串，比如可能是一个组件的配置对象或者是一个组件的构造函数
  // direct component options / constructor
  vnode = createComponent(tag, data, context, children);
}
```

这里先对<span :class="$style.common_text"> tag </span> 做判断，如果是 <span :class="$style.common_text">string 类型</span>，则接着判断如果是内置的一些节
点，则直接创建一个普通 VNode，如果是为已注册的组件名，则通
过 createComponent 创建一个组件类型的 VNode，否则创建一个未知的标签的
VNode。 如果是 tag 一个 <span :class="$style.common_text">Component</span> 类型，则直接调用 createComponent 创
建一个组件类型的 VNode 节点。对于 createComponent 创建组件类型的
VNode 的过程, 本质上它还是返回了一个 VNode。<br><br>

大致了解了 <span :class="$style.common_text">createElement</span> 创建 VNode 的过程，每个 VNode
有 children，children 每个元素也是一个 VNode，这样就形成了一个 <span :class="$style.common_text">VNode
Tree</span>，它很好的描述了我们的 <span :class="$style.common_text">DOM Tree</span>。

## update

<br>
Vue 的 <span :class="$style.common_text">_update</span> 是实例的一个私有方法，它被调用的时机有 2 个，一个是首次渲染，一个是数据更新的时候；这里只分析首次渲染部分，数据更新部分会在之后分析响应式原理的时候涉及。_update 方法的作用是把VNode 渲染成真实的 DOM，它的定义在<span :class="$style.common_text">src/core/instance/lifecycle.js</span> 中：

```js
/**
 * 页面首次渲染和后续更新的入口位置，也是 patch 的入口位置
 */
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this;
  // 页面的挂载点，真实的元素
  const prevEl = vm.$el;
  // 老 VNode
  const prevVnode = vm._vnode;
  const restoreActiveInstance = setActiveInstance(vm);
  // 新 VNode
  vm._vnode = vnode;
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // 老 VNode 不存在，表示首次渲染，即初始化页面时走这里
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
  } else {
    // 响应式数据更新时，即更新页面时走这里
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
  restoreActiveInstance();
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null;
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm;
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el;
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
};
```

<span :class="$style.common_text">\_update</span> 的核心就是调用 <span :class="$style.common_text">vm.**patch** </span>方法，这个方法实际上在不同的平台，比如 web 和 weex 上的定义是不一样的，因此在 web 平台中它的定义
在 <span :class="$style.common_text">src/platforms/web/runtime/index.js</span> 中：

```js
// 在 Vue 原型链上安装 web 平台的 patch 函数
Vue.prototype.__patch__ = inBrowser ? patch : noop;
```

可以看到，甚至在 web 平台上，是否是服务端渲染也会对这个方法产生影响。
因为在服务端渲染中，没有真实的浏览器 DOM 环境，所以不需要把 VNode
最终转换成 DOM，因此是一个空函数，而在浏览器端渲染中，它指向了 <span :class="$style.red_text">patch</span> 方法，它的定义在<span :class="$style.red_text">src/platforms/web/runtime/patch.js</span> 中：

```js
/* @flow */

import * as nodeOps from "web/runtime/node-ops";
import { createPatchFunction } from "core/vdom/patch";
import baseModules from "core/vdom/modules/index";
import platformModules from "web/runtime/modules/index";

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules);

// patch 工厂函数，为其传入平台特有的一些操作，然后返回一个 patch 函数
export const patch: Function = createPatchFunction({ nodeOps, modules });
```

该方法的定义是调用 createPatchFunction 方法的返回值，这里传入了一个对象，
包含 nodeOps 参数和 modules 参数。其中，<span :class="$style.red_text">nodeOps</span> 封装了一系列 DOM 操作
的方法，<span :class="$style.red_text">modules</span> 定义了一些模块的钩子函数的实现，先不详细介绍，
来看一下 <span :class="$style.red_text">createPatchFunction</span> 的实现，它定义在 <span :class="$style.red_text">src/core/vdom/patch.js</span> 中：

```js
/**
 * 工厂函数，注入平台特有的一些功能操作，并定义一些方法，然后返回 patch 函数
 */
export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  /**
   * modules: { 框架核心的 ref, directives, 平台特有的一些操纵，比如 attr、class、style 等 }
   * nodeOps: { 操作节点的 API，比如 web 平台的 DOM 操作 }
   */
  const { modules, nodeOps } = backend

  /**
   * hooks = ['create', 'activate', 'update', 'remove', 'destroy']
   * 遍历这些钩子，然后从 modules 的各个模块中找到相应的方法，比如：directives 中的 create、update、destroy 方法
   * 让这些方法放到 cb[hook] = [hook 方法] 中，比如: cb.create = [fn1, fn2, ...]
   * 然后在合适的时间调用相应的钩子方法完成对应的操作
   */
  for (i = 0; i < hooks.length; ++i) {
    // 比如 cbs.create = []
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        // 遍历各个 modules，找出各个 module 中的 create 方法，然后添加到 cbs.create 数组中
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

  // ....

  /**
   * vm.__patch__
   *   1、新节点不存在，老节点存在，调用 destroy，销毁老节点
   *   2、如果 oldVnode 是真实元素，则表示首次渲染，创建新节点，并插入 body，然后移除老节点
   *   3、如果 oldVnode 不是真实元素，则表示更新阶段，执行 patchVnode
   */
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    // 如果新节点不存在，老节点存在，则调用 destroy，销毁老节点
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      // 新的 VNode 存在，老的 VNode 不存在，这种情况会在一个组件初次渲染的时候出现，比如：
      // <div id="app"><comp></comp></div>
      // 这里的 comp 组件初次渲染时就会走这儿
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      // 判断 oldVnode 是否为真实元素
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // 不是真实元素，但是老节点和新节点是同一个节点，则是更新阶段，执行 patch 更新节点
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        // 是真实元素，则表示初次渲染
        if (isRealElement) {
          // 挂载到真实元素以及处理服务端渲染的情况
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // 走到这儿说明不是服务端渲染，或者 hydration 失败，则根据 oldVnode 创建一个 vnode 节点
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode)
        }

        // 拿到老节点的真实元素
        const oldElm = oldVnode.elm
        // 获取老节点的父元素，即 body
        const parentElm = nodeOps.parentNode(oldElm)

        // 基于 vnode 创建整棵节点树并插入到 body 元素下
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // 递归更新父占位符节点元素
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // 移除老节点
        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }

```

createPatchFunction 内部定义了一系列的辅助方法，最终返回了一个 patch 方
法，这个方法就赋值给了 vm.\_update 函数里调用的 vm.**patch**。<br>
在介绍 patch 的方法实现之前，我们可以思考一下为何 Vue.js 源码绕了这么
一大圈，把相关代码分散到各个目录。因为<span :class="$style.common_text">patch</span> 是平台相关的，
在 Web 和 Weex 环境，它们把虚拟 DOM 映射到 “平台 DOM” 的方法是不
同的，并且对 “DOM” 包括的属性模块创建和更新也不尽相同。因此每个平台
都有各自的 nodeOps 和 modules，它们的代码需要托管在 <span :class="$style.common_text">src/platforms</span> 这个
大目录下。<br>
而不同平台的 patch 的主要逻辑部分是相同的，所以这部分公共的部分托管在
core 这个大目录下。差异化部分只需要通过参数来区别，这里用到了一个<span :class="$style.common_text">函数
柯里化</span>的技巧，通过 createPatchFunction 把差异化参数提前固化，这样不用每次调用 patch 的时候都传递 nodeOps 和 modules 了，这种编程技巧也非常值
得学习。<br>
patch 方法本身，它接收 4 个参数，<span :class="$style.common_text">oldVnode</span> 表示旧的 VNode 节点，它
也可以不存在或者是一个 DOM 对象；<span :class="$style.common_text">vnode</span> 表示执行 \_render 后返回的
VNode 的节点；<span :class="$style.common_text">hydrating</span> 表示是否是服务端渲染；<span :class="$style.common_text">removeOnly</span> 是给 transition-group 用的。<br>

在 <span :class="$style.common_text">patch</span> 函数中，有一个重要函数<span :class="$style.common_text"> createElm</span>，主要就是调用原生 DOM API 进行 DOM 操作，最后更新真实 DOM 到 body 上。<br>
其中执行创建子节点，插入子节点到父节点容器中，因为是递归调用，所以 vnode 树的插入是先子后父。

<style module>
.special_text {
  color: #00BCD4; 
  font-size: 20px; 
  padding: 20px 0;
}
.common_text {
  color: #E6A23C; 
  font-size: 20px; 
  padding: 20px 0;
}
.red_text {
  color: #f04d3c;
  font-size: 20px; 
  padding: 20px 0;
}
</style>
