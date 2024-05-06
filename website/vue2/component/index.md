## 组件化

<span :class="$style.common_text">Vue.js</span> 另一个核心思想是组件化。所谓<span :class="$style.common_text">组件化</span>，就是把页面拆分成多个组件
(component)，每个组件依赖的 CSS、JavaScript、模板、图片等资源放在一
起开发和维护。组件是资源独立的，组件在系统内部可复用，组件和组件之间
可以嵌套。<br>

我们在用 Vue.js 开发实际项目的时候，就是像搭积木一样，编写一堆组件拼装
生成页面。在 Vue.js 的官网中，也是花了大篇幅来介绍什么是组件，如何编写
组件以及组件拥有的属性和特性。<br>

这一章节主要从源码的角度来分析 Vue 的组件内部是如何工作的，
只有了解了内部的工作原理，才能让我们使用它的时候更加得心应手。
接下来我们会用 Vue-cli 初始化的代码为例，来分析一下 Vue 组件初始化的一
个过程。

```js
import Vue from "vue";
import App from "./App.vue";
var app = new Vue({
  el: "#app",
  // 这里的 h 是 createElement 方法
  render: (h) => h(App),
});
```

这段代码相信很多同学都很熟悉，它和我们上一章相同的点也是通过 render
函数去渲染的，不同的这次通过<span :class="$style.red_text"> createElement </span> 传的参数是一个组件而不是一
个原生的标签。

## createComponent

上一章我们在分析 <span :class="$style.red_text">createElement</span> 的实现的时候，它最终会调用 <span :class="$style.red_text">\_createElemen</span>
t 方法，其中有一段逻辑是对参数 tag 的判断，如果是一个普通的 html 标签，
像上一章的例子那样是一个普通的 div，则会实例化一个普通 VNode 节点，
否则通过 <span :class="$style.red_text">createComponent</span> 方法创建一个组件 VNode。

```js
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
```

在我们这一章传入的是一个 App 对象，它本质上是一个<span :class="$style.red_text">Component</span> 类型，那
么它会走到上述代码的 else 逻辑，直接通过 <span :class="$style.red_text">createComponent</span> 方法来创
建 vnode。所以接下来我们来看一下 <span :class="$style.red_text">createComponent</span> 方法的实现，它定义在
src/core/vdom/create-component.js 文件中：

```js
/**
 * 创建组件的 VNode，
 *   1、函数式组件通过执行其 render 方法生成组件的 VNode
 *   2、普通组件通过 new VNode() 生成其 VNode，但是普通组件有一个重要操作是在 data.hook 对象上设置了四个钩子函数，
 *      分别是 init、prepatch、insert、destroy，在组件的 patch 阶段会被调用，
 *      比如 init 方法，调用时会进入子组件实例的创建挂载阶段，直到完成渲染
 * @param {*} Ctor 组件构造函数
 * @param {*} data 属性组成的 JSON 字符串
 * @param {*} context 上下文
 * @param {*} children 子节点数组
 * @param {*} tag 标签名
 * @returns VNode or Array<VNode>
 */
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // 组件构造函数不存在，直接结束
  if (isUndef(Ctor)) {
    return;
  }

  // Vue.extend 组件构造器的生成
  const baseCtor = context.$options._base;

  // 当 Ctor 为配置对象时，通过 Vue.extend 将其转为构造函数
  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // 如果到这个为止，Ctor 仍然不是一个函数，则表示这是一个无效的组件定义
  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== "function") {
    if (process.env.NODE_ENV !== "production") {
      warn(`Invalid Component definition: ${String(Ctor)}`, context);
    }
    return;
  }

  // 异步组件
  // async component
  let asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // 为异步组件返回一个占位符节点，组件被渲染为注释节点，但保留了节点的所有原始信息，这些信息将用于异步服务器渲染 和 hydration
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  // 节点的属性 JSON 字符串
  data = data || {};

  // 这里其实就是组件做选项合并的地方，即编译器将组件编译为渲染函数，渲染时执行 render 函数，然后执行其中的 _c，就会走到这里了
  // 解析构造函数选项，并合基类选项，以防止在组件构造函数创建后应用全局混入
  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // 将组件的 v-model 的信息（值和回调）转换为 data.attrs 对象的属性、值和 data.on 对象上的事件、回调
  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // 提取 props 数据，得到 propsData 对象，propsData[key] = val
  // 以组件 props 配置中的属性为 key，父组件中对应的数据为 value
  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // 函数式组件
  // functional component
  if (isTrue(Ctor.options.functional)) {
    /**
     * 执行函数式组件的 render 函数生成组件的 VNode，做了以下 3 件事：
     *   1、设置组件的 props 对象
     *   2、设置函数式组件的渲染上下文，传递给函数式组件的 render 函数
     *   3、调用函数式组件的 render 函数生成 vnode
     */
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // 获取事件监听器对象 data.on，因为这些监听器需要作为子组件监听器处理，而不是 DOM 监听器
  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on;
  // 将带有 .native 修饰符的事件对象赋值给 data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // 如果是抽象组件，则值保留 props、listeners 和 slot
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  /**
   * 在组件的 data 对象上设置 hook 对象，
   * hook 对象增加四个属性，init、prepatch、insert、destroy，
   * 负责组件的创建、更新、销毁，这些方法在组件的 patch 阶段会被调用
   * install component management hooks onto the placeholder node
   */
  installComponentHooks(data);

  const name = Ctor.options.name || tag;
  // 实例化组件的 VNode，对于普通组件的标签名会比较特殊，vue-component-${cid}-${name}
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ""}`,
    data,
    undefined,
    undefined,
    undefined,
    context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode);
  }

  return vnode;
}
```

可以看到，createComponent 的逻辑也会有一些复杂，但是分析源码比较推荐的
是只分析核心流程，分支流程可以之后针对性的看，所以这里针对组件渲染这
个 case 主要就 3 个关键步骤：<br>
<span :class="$style.special_text">构造子类构造函数</span>，<span :class="$style.special_text">安装组件钩子函数</span>和<span :class="$style.special_text">实例化 vnode</span>。

### 构造子类构造函数

```js
const baseCtor = context.$options._base;
// plain options object: turn it into a constructor
if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor);
}
```

在编写一个组件的时候，通常都是创建一个普通对象，还是以我们的
App.vue 为例，代码如下：

```js
import HelloWorld from "./components/HelloWorld";
export default {
  name: "app",
  components: {
    HelloWorld,
  },
};
```

这里 export 的是一个对象，所以 <span :class="$style.red_text">createComponent</span> 里的代码逻辑会执行
到 baseCtor.extend(Ctor)，在这里 <span :class="$style.special_text">baseCtor</span> 实际上就是 Vue 构造函数，这个的定义是
在最开始初始化 Vue 的阶段，在 src/core/global-api/index.js 中
的 <span :class="$style.special_text">initGlobalAPI</span> 函数有这么一段逻辑：

```js
// this is used to identify the "base" constructor to extend all plain-object;
// components with in Weex's multi-instance scenarios.
Vue.options._base = Vue;
```

这里定义的是 <span :class="$style.red_text">Vue.option</span>，而我们的 createComponent 取
的是 <span :class="$style.red_text">context.$options</span>，实际上在 src/core/instance/init.js 里 Vue 原型上
的 \_init 函数中有这么一段逻辑：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
);
```

这样就把 Vue 上的一些 option 扩展到了<span :class="$style.red_text"> vm.$option</span> 上，所以也就能通
过 <span :class="$style.red_text">vm.$options._base</span> 拿到 Vue 这个构造函数了。mergeOptions 的实现我们会
在后续章节中具体分析，现在只需要理解它的功能是把 Vue 构造函数
的 options 和用户传入的 options 做一层合并，到 vm.$options 上。
在了解了 baseCtor 指向了 Vue 之后，我们来看一下 <span :class="$style.red_text">Vue.extend</span> 函数的定义，
在 src/core/global-api/extend.js 中。

```js
/**
 * 基于 Vue 去扩展子类，该子类同样支持进一步的扩展
 * 扩展时可以传递一些默认配置，就像 Vue 也会有一些默认配置
 * 默认配置如果和基类有冲突则会进行选项合并（mergeOptions)
 */
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {};
  const Super = this;
  const SuperId = Super.cid;

  /**
   * 利用缓存，如果存在则直接返回缓存中的构造函数
   * 什么情况下可以利用到这个缓存？
   *   如果你在多次调用 Vue.extend 时使用了同一个配置项（extendOptions），这时就会启用该缓存
   */
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId];
  }

  const name = extendOptions.name || Super.options.name;
  if (process.env.NODE_ENV !== "production" && name) {
    validateComponentName(name);
  }

  // 定义 Sub 构造函数，和 Vue 构造函数一样
  const Sub = function VueComponent(options) {
    // 初始化
    this._init(options);
  };
  // 通过原型继承的方式继承 Vue
  Sub.prototype = Object.create(Super.prototype);
  Sub.prototype.constructor = Sub;
  Sub.cid = cid++;
  // 选项合并，合并 Vue 的配置项到 自己的配置项上来
  Sub.options = mergeOptions(Super.options, extendOptions);
  // 记录自己的基类
  Sub["super"] = Super;

  // 初始化 props，将 props 配置代理到 Sub.prototype._props 对象上
  // 在组件内通过 this._props 方式可以访问
  if (Sub.options.props) {
    initProps(Sub);
  }

  // 初始化 computed，将 computed 配置代理到 Sub.prototype 对象上
  // 在组件内可以通过 this.computedKey 的方式访问
  if (Sub.options.computed) {
    initComputed(Sub);
  }

  // 定义 extend、mixin、use 这三个静态方法，允许在 Sub 基础上再进一步构造子类
  Sub.extend = Super.extend;
  Sub.mixin = Super.mixin;
  Sub.use = Super.use;

  // 定义 component、filter、directive 三个静态方法
  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type];
  });

  // 递归组件的原理，如果组件设置了 name 属性，则将自己注册到自己的 components 选项中
  if (name) {
    Sub.options.components[name] = Sub;
  }

  // 在扩展时保留对基类选项的引用。
  // 稍后在实例化时，我们可以检查 Super 的选项是否具有更新
  Sub.superOptions = Super.options;
  Sub.extendOptions = extendOptions;
  Sub.sealedOptions = extend({}, Sub.options);

  // 缓存
  cachedCtors[SuperId] = Sub;
  return Sub;
};
```

<span :class="$style.red_text">Vue.extend</span> 的作用就是构造一个 Vue 的子类，它使用一种非常经典的<span :class="$style.red_text">原型继承</span>
的方式把一个纯对象转换一个继承于 Vue 的构造器 Sub 并返回，然后对 Sub
这个对象本身扩展了一些属性，如扩展 options、添加全局 API 等；并且对配
置中的 props 和 computed 做了初始化工作；最后对于这个 Sub 构造函数做
了缓存，避免多次执行 Vue.extend 的时候对同一个子组件重复构造。<br>
这样当我们去实例化 Sub 的时候，就会执行 this.\_init 逻辑再次走到了 Vue
实例的初始化逻辑。

```js
const Sub = function VueComponent(options) {
  this._init(options);
};
```

### 安装组件钩子函数

```js
// install component management hooks onto the placeholder node
installComponentHooks(data);
```

之前提到 Vue.js 使用的 Virtual DOM 参考的是开源库 <span :class="$style.common_text">snabbdom</span>，它的
一个特点是在 VNode 的 <span :class="$style.red_text">patch</span> 流程中对外暴露了各种时机的钩子函数，方便
我们做一些额外的事情，Vue.js 也是充分利用这一点，在初始化一个
Component 类型的 VNode 的过程中实现了几个钩子函数：

```js
// patch 期间在组件 vnode 上调用内联钩子
// inline hooks to be invoked on component VNodes during patch
const componentVNodeHooks = {
  // 初始化
  init(vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // 被 keep-alive 包裹的组件
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      // 创建组件实例，即 new vnode.componentOptions.Ctor(options) => 得到 Vue 组件实例
      const child = (vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      ));
      // 执行组件的 $mount 方法，进入挂载阶段，接下来就是通过编译器得到 render 函数，接着走挂载、patch 这条路，直到组件渲染到页面
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  // 更新 VNode，用新的 VNode 配置更新旧的 VNode 上的各种属性
  prepatch(oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    // 新 VNode 的组件配置项
    const options = vnode.componentOptions;
    // 老 VNode 的组件实例
    const child = (vnode.componentInstance = oldVnode.componentInstance);
    // 用 vnode 上的属性更新 child 上的各种属性
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  // 执行组件的 mounted 声明周期钩子
  insert(vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode;
    // 如果组件未挂载，则调用 mounted 声明周期钩子
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, "mounted");
    }
    // 处理 keep-alive 组件的异常情况
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  /**
   * 销毁组件
   *   1、如果组件被 keep-alive 组件包裹，则使组件失活，不销毁组件实例，从而缓存组件的状态
   *   2、如果组件没有被 keep-alive 包裹，则直接调用实例的 $destroy 方法销毁组件
   */
  destroy(vnode: MountedComponentVNode) {
    // 从 vnode 上获取组件实例
    const { componentInstance } = vnode;
    if (!componentInstance._isDestroyed) {
      // 如果组件实例没有被销毁
      if (!vnode.data.keepAlive) {
        // 组件没有被 keep-alive 组件包裹，则直接调用 $destroy 方法销毁组件
        componentInstance.$destroy();
      } else {
        // 负责让组件失活，不销毁组件实例，从而缓存组件的状态
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  },
};

/**
 * 在组件的 data 对象上设置 hook 对象，
 * hook 对象增加四个属性，init、prepatch、insert、destroy，
 * 负责组件的创建、更新、销毁
 */
function installComponentHooks(data: VNodeData) {
  const hooks = data.hook || (data.hook = {});
  // 遍历 hooksToMerge 数组，hooksToMerge = ['init', 'prepatch', 'insert' 'destroy']
  for (let i = 0; i < hooksToMerge.length; i++) {
    // 比如 key = init
    const key = hooksToMerge[i];
    // 从 data.hook 对象中获取 key 对应的方法
    const existing = hooks[key];
    // componentVNodeHooks 对象中 key 对象的方法
    const toMerge = componentVNodeHooks[key];
    // 合并用户传递的 hook 方法和框架自带的 hook 方法，其实就是分别执行两个方法
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook(f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged;
}
```

整个 <span :class="$style.red_text">installComponentHooks</span> 的过程就是把 componentVNodeHooks 的钩子函数合
并到 <span :class="$style.red_text">data.hook</span> 中，在 VNode 执行 patch 的过程中执行相关的钩子函数，具
体的执行稍后在介绍 patch 过程中会详细介绍。这里要注意的是合并策略，
在合并过程中，如果某个时机的钩子已经存在 data.hook 中，那么通过执行
<span :class="$style.red_text">mergeHook</span> 函数做合并，这个逻辑很简单，就是在最终执行的时候，依次执行这
两个钩子函数即可。

### 实例化 Vnode

```js
const name = Ctor.options.name || tag;
// 实例化组件的 VNode，对于普通组件的标签名会比较特殊，vue-component-${cid}-${name}
const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ""}`,
  data,
  undefined,
  undefined,
  undefined,
  context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
);
return vnode;
```

最后一步非常简单，通过<span :class="$style.common_text"> new VNode </span> 实例化一个 vnode 并返回。需要注意的
是和普通元素节点的 vnode 不同，组件的 vnode 是没有 children 的，这点很关键。

## patch

通过 <span :class="$style.red_text">createComponent</span> 创建了组件 VNode，接下来会走到 <span :class="$style.common_text">vm.\_update</span>，执行<span :class="$style.common_text"> vm.**patch** </span>去把 VNode 转换成真正的 DOM 节点。这个过程我们在前一章已经分析过了，但是针对一个普通
的 VNode 节点，接下来我们来看看组件的 VNode 会有哪些不一样的地方。<br>
patch 的过程会调用<span :class="$style.red_text"> createElm </span>创建元素节点，回顾一下 createElm 的实现，
它的定义在 src/core/vdom/patch.js 中：

```js
function createElm(
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  /**
   * 重点
   * 1、如果 vnode 是一个组件，则执行 init 钩子，创建组件实例并挂载，
   *   然后为组件执行各个模块的 create 钩子
   *   如果组件被 keep-alive 包裹，则激活组件
   * 2、如果是一个普通元素，则什么也不错
   */
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return;
  }
  // ...
}
```

只展示关键代码，这里会判断 createComponent(vnode,insertedVnodeQueue, parentElm, refElm) 的返回值，如果为 true 则直接结束，
那么接下来看一下 <span :class="$style.red_text">createComponent</span> 方法的实现：

```js
/**
 * 如果 vnode 是一个组件，则执行 init 钩子，创建组件实例，并挂载
 * 然后为组件执行各个模块的 create 方法
 * @param {*} vnode 组件新的 vnode
 * @param {*} insertedVnodeQueue 数组
 * @param {*} parentElm oldVnode 的父节点
 * @param {*} refElm oldVnode 的下一个兄弟节点
 * @returns 如果组件被 keep-alive 包裹，则返回 true，否则为 undefined
 */
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  // 获取 vnode.data 对象
  let i = vnode.data;
  if (isDef(i)) {
    // 验证组件实例是否已经存在 && 被 keep-alive 包裹
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    // 执行 vnode.data.init 钩子函数，该函数在讲 render helper 时讲过
    // 如果是被 keep-alive 包裹的组件：则再执行 prepatch 钩子，用 vnode 上的各个属性更新 oldVnode 上的相关属性
    // 如果是组件没有被 keep-alive 包裹或者首次渲染，则初始化组件，并进入挂载阶段
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      i(vnode, false /* hydrating */);
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      // 如果 vnode 是一个子组件，则调用 init 钩子之后会创建一个组件实例，并挂载
      // 这时候就可以给组件执行各个模块的的 create 钩子了
      initComponent(vnode, insertedVnodeQueue);
      // 将组件的 DOM 节点插入到父节点内
      insert(parentElm, vnode.elm, refElm);
      if (isTrue(isReactivated)) {
        // 组件被 keep-alive 包裹的情况，激活组件
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
      }
      return true;
    }
  }
}
```

createComponent 函数中，首先对 vnode.data 做了一些判断：

```js
let i = vnode.data;
if (isDef(i)) {
  // ...
  if (isDef((i = i.hook)) && isDef((i = i.init))) {
    i(vnode, false /* hydrating */);
    // ...
  }
  // ..
}
```

如果 vnode 是一个组件 VNode，那么条件会满足，并且得到 i 就是 <span :class="$style.red_text">init
钩子函数</span>，回顾上节我们在创建组件 VNode 的时候合并钩子函数中就包含 init 钩子函数，定义在 src/core/vdom/create-component.js 中：

```js
// 初始化
  init(vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // 被 keep-alive 包裹的组件
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      // 创建组件实例，即 new vnode.componentOptions.Ctor(options) => 得到 Vue 组件实例
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      // 执行组件的 $mount 方法，进入挂载阶段，接下来就是通过编译器得到 render 函数，接着走挂载、patch 这条路，直到组件渲染到页面
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
```

init 钩子函数执行也很简单，我们先不考虑 keepAlive 的情况，它是通过 <span :class="$style.red_text">cre
ateComponentInstanceForVnode</span> 创建一个 Vue 的实例，然后调用 $mount 方法挂载子组件，
先来看一下 <span :class="$style.red_text">createComponentInstanceForVnode</span> 的实现：

```js
/**
 * new vnode.componentOptions.Ctor(options) => 得到 Vue 组件实例
 */
export function createComponentInstanceForVnode(
  // we know it's MountedComponentVNode but flow doesn't
  vnode: any,
  // activeInstance in lifecycle state
  parent: any
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent,
  };
  // 检查内联模版渲染函数
  const inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  // new VueComponent(options) => Vue 实例
  return new vnode.componentOptions.Ctor(options);
}
```

<span :class="$style.red_text">createComponentInstanceForVnode</span> 函数构造的一个内部组件的参数，然后执行 new vnode.componentOptions.Ctor(options)。这里的 vnode.componentOptions.Ctor
对应的就是子组件的构造函数，上一节分析了它实际上是继承于 Vue 的一
个构造器 Sub，相当于<span :class="$style.red_text"> new Sub(options) </span>这里有几个关键参数要注意几个点，
\_isComponent 为 true 表示它是一个组件，parent 表示当前激活的组件实例。<br>
所以子组件的实例化实际上就是在这个时机执行的，并且它会执行实例的<span :class="$style.red_text"> \_init </span> 方法，这个过程有一些和之前不同的地方需要挑出来说，代码在 <span :class="$style.red_text">src/core/
instance/init.js </span> 中：

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this;
  // merge options 组件初始化
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options);
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    );
  }
  // ...
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```

这里首先是合并 options 的过程有变化，<span :class="$style.red_text">\_isComponent</span> 为 true，所以走到
了 <span :class="$style.red_text">initInternalComponent</span>过程，这个函数的实现也简单看一下：

```js
export function initInternalComponent(
  vm: Component,
  options: InternalComponentOptions
) {
  const opts = (vm.$options = Object.create(vm.constructor.options));
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}
```

这个过程我们重点记住以下几个点即可：<span :class="$style.red_text">opts.parent = options.parent、opts.\_parentVnode = parentVnode </span>，它们是把之前我们通
过 <span :class="$style.red_text">createComponentInstanceForVnode</span> 函数传入的几个参数合并到内部的选项 $
options 里了。<br>
由于组件初始化的时候是不传 el 的，因此组件是自己接管了 $mount 的过程，
这个过程的主要流程在上一章介绍过了，回到组件 init 的过程，componentVNodeHooks 的 init 钩子函数，在完成实例化的 _init 后，接着会执行 <span :class="$style.red_text">child.$mount(hydrating ? vnode.elm : undefined, hydrating)</span> 。这里 hydrating 为 true 一般是服务端渲染的情况，我们只考虑客户端渲染，所
以这里 $mount 相当于执行 <span :class="$style.red_text">child.$mount(undefined, false)</span>，它最终会调
用 <span :class="$style.red_text">mountComponent</span> 方法，进而执行 vm.\_render() 方法：

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this;
  const { render, _parentVnode } = vm.$options;
  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode;
  // render self
  let vnode;
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement);
  } catch (e) {
    // ...
  }
  // set parent
  vnode.parent = _parentVnode;
  return vnode;
};
```

只保留关键部分的代码，这里的 \_parentVnode 就是当前组件的父 VNode，而 render 函数生成的 vnode 当前组件的渲染 vnode，vnode 的 parent 指向了<span :class="$style.common_text"> \_parentVnode</span>，也就是 vm.$vnode，它们是一种父子的关系。
我们知道在执行完<span :class="$style.common_text"> vm.\_render </span>生成 VNode 后，接下来就要执行 <span :class="$style.common_text">vm.\_update</span>去渲染 VNode 了。来看一下组件渲染的过程中有哪些需要注意的，vm.\_update 的定义在 src/core/instance/lifecycle.js 中：

```js
export let activeInstance: any = null;
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this;
  const prevEl = vm.$el;
  const prevVnode = vm._vnode;
  const prevActiveInstance = activeInstance;
  activeInstance = vm;
  vm._vnode = vnode;
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(
      vm.$el,
      vnode,
      hydrating,
      false
      /* removeOnly
       */
    );
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode);
  }
  activeInstance = prevActiveInstance;
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
  // updated hook is called by the scheduler to ensure that children
  are;
  // updated in a parent's updated hook.
};
```

<span :class="$style.common_text">\_update</span> 过程中有几个关键的代码，首先 vm.\_vnode = vnode 的逻辑，这
个 vnode 是通过 vm.\_render() 返回的组件渲染 VNode，vm.\_vnode 和 vm.
$vnode 的关系就是一种父子关系，用代码表达就是 <span :class="$style.common_text">vm.parent.\_vnode === vm.
$vnode</span>。 <br>

这个 <span :class="$style.red_text">activeInstance</span> 作用就是保持当前上下文的 Vue 实例，它是
在 lifecycle 模块的全局变量，定义是<span :class="$style.red_text"> export let activeInstance: any =
null </span>，并且在之前我们调用 createComponentInstanceForVnode 方法的时候从 li
fecycle 模块获取，并且作为参数传入的。因为实际上 JavaScript 是一个单线
程，Vue 整个初始化是一个深度遍历的过程，<span :class="$style.common_text">在实例化子组件的过程中，它需
要知道当前上下文的 Vue 实例是什么</span>，并把它作为子组件的父 Vue 实例。之
前我们提到过对子组件的实例化过程先会调用 <span :class="$style.red_text">initInternalComponent(vm,
options)</span> 合并 options，把 parent 存储在 vm.$options 中，在 $mount 之前
会调用 initLifecycle(vm)方法：

```js
export function initLifecycle(vm: Component) {
  const options = vm.$options;
  // locate first non-abstract parent
  let parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }
  vm.$parent = parent;
  // ...
}
```

可以看到 <span :class="$style.red_text">vm.$parent</span> 就是用来保留当前 vm 的父实例，并且通过 <span :class="$style.red_text">parent.
$children.push(vm) </span> 来把当前的 vm 存储到父实例的 $children 中。
在 vm._update 的过程中，把当前的 vm 赋值给 activeInstance，同时通过<span :class="$style.red_text"> const prevActiveInstance = activeInstance </span> 用 prevActiveInstance 保留上一次
的 activeInstance。实际上，<span :class="$style.common_text">prevActiveInstance 和当前的 vm 是一个父子关系，
当一个 vm 实例完成它的所有子树的 patch 或者 update 过程后，
activeInstance 会回到它的父实例，这样就完美地保证了 createComponentInstan
ceForVnode 整个深度遍历过程中</span>，我们在实例化子组件的时候能传入当前子组
件的父 Vue 实例，并在 \_init 的过程中，通过 vm.$parent 把这个父子关系保留。 <br>

那么回到 \_update，最后就是调用 **patch** 渲染 VNode 了。

```js
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
function patch(oldVnode, vnode, hydrating, removeOnly) {
  // ...
  let isInitialPatch = false;
  const insertedVnodeQueue = [];
  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true;
    createElm(vnode, insertedVnodeQueue);
  } else {
    // ...
  }
  // ...
}
```

这里又回到了本节开始的过程，之前分析过负责渲染成 DOM 的函数
是 createElm，注意这里我们只传了 2 个参数，所以对应的 parentElm
是 undefined。我们再来看看它的定义：

```js
function createElm(
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return;
  }
  const data = vnode.data;
  const children = vnode.children;
  const tag = vnode.tag;
  if (isDef(tag)) {
    // ...
    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode);
    setScope(vnode);
    /* istanbul ignore if */
    if (__WEEX__) {
      // ...
    } else {
      createChildren(vnode, children, insertedVnodeQueue);
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
      }
      insert(parentElm, vnode.elm, refElm);
    }
    // ...
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text);
    insert(parentElm, vnode.elm, refElm);
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text);
    insert(parentElm, vnode.elm, refElm);
  }
}
```

注意，这里我们传入的 <span :class="$style.special_text">vnode</span> 是组件渲染的 vnode，也就是我们之前说的 vm
.\_vnode，如果组件的根节点是个普通元素，那么 vm.\_vnode 也是普通的 vnod
e，这里 <span :class="$style.special_text">createComponent(vnode, insertedVnodeQueue, parentElm, refElm)</span> 的返回值是 false。接下来的过程就和我们上一章一样了，先创建一个父节点占位符，
然后再遍历所有子 VNode 递归调用 createElm，在遍历的过程中，如果遇到
子 VNode 是一个组件的 VNode，则重复本节开始的过程，<span :class="$style.special_text">这样通过一个递归
的方式就可以完整地构建了整个组件树</span>。
由于我们这个时候传入的 parentElm 是空，所以对组件的插入，在 createComp
onent 有这么一段逻辑：

```js
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data;
  if (isDef(i)) {
    // ....
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      i(vnode, false /* hydrating */);
    }
    // ...
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue);
      insert(parentElm, vnode.elm, refElm);
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
      }
      return true;
    }
  }
}
```

在完成组件的整个 patch 过程后，最后执行 <span :class="$style.special_text">insert(parentElm, vnode.elm,
refElm)</span> 完成组件的 DOM 插入，如果组件 patch 过程中又创建了子组件，那
么 DOM 的插入顺序是<span :class="$style.special_text">先子后父</span>。

## 合并配置

## 生命周期

## 组件注册

## 异步组件

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
