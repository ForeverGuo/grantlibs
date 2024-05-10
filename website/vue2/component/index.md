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
对应的就是子组件的构造函数，上一节分析了它实际上是继承于 Vue 的一个构造器 Sub，相当于<span :class="$style.red_text"> new Sub(options) </span>这里有几个关键参数要注意几个点，\_isComponent 为 true 表示它是一个组件，parent 表示当前激活的组件实例。<br>
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

这个过程我们重点记住以下几个点即可：<span :class="$style.red_text">opts.parent = options.parent、opts.\_parentVnode = parentVnode </span>，它们是把之前我们通过 <span :class="$style.red_text">createComponentInstanceForVnode </span> 函数传入的几个参数合并到内部的选项 $options 里了。<br>
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
$vnode 的关系就是一种父子关系，用代码表达就是 <span :class="$style.common_text">vm.parent.\_vnode === vm.$vnode</span>。 <br>

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

可以看到 <span :class="$style.red_text">vm.$parent</span> 就是用来保留当前 vm 的父实例，并且通过 <span :class="$style.red_text">parent.$children.push(vm) </span> 来把当前的 vm 存储到父实例的 $children 中。
在 vm._update 的过程中，把当前的 vm 赋值给 activeInstance，同时通过<span :class="$style.red_text"> const prevActiveInstance = activeInstance </span> 用 prevActiveInstance 保留上一次的 activeInstance。实际上，<span :class="$style.common_text">prevActiveInstance 和当前的 vm 是一个父子关系，
当一个 vm 实例完成它的所有子树的 patch 或者 update 过程后，activeInstance 会回到它的父实例，这样就完美地保证了 createComponentInstanceForVnode 整个深度遍历过程中</span>，我们在实例化子组件的时候能传入当前子组
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

这里又回到了本节开始的过程，之前分析过负责渲染成 DOM 的函数是 createElm，注意这里我们只传了 2 个参数，所以对应的 parentElm 是 undefined。我们再来看看它的定义：

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

注意，这里我们传入的 vnode 是组件渲染的 vnode，也就是我们之前说的 vm.vnode，如果组件的根节点是个普通元素，那么 vm.vnode 也是普通的 vnode，这里 createComponent(vnode, insertedVnodeQueue, parentElm,refElm) 的返回值 false。接下来的过程就和我们上一章一样了，先创建一个父节点占位符，然后再遍历所有子 VNode 递归调用 createElm，在遍历的过程中，如果遇到子 VNode 是一个组件的 VNode，则重复本节开始的过程，这样通过一个递归的方式就可以完整地构建了整个组件树。由于我们这个时候传入的 parentElm 是空，所以对组件的插入，在 createComponent 有这么一段逻辑：<br/>

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
refElm)</span> 完成组件的 DOM 插入，如果组件 patch 过程中又创建了子组件，那么 DOM 的插入顺序是<span :class="$style.special_text">先子后父</span>。

## 合并配置

通过之前章节的源码分析我们知道，<span :class="$style.red_text">new Vue</span> 的过程通常有 2 种场景，一种是
外部我们的代码主动调用 <span :class="$style.red_text">new Vue(options)</span> 的方式实例化一个 Vue 对象；另
一种是上一节分析的组件过程中内部通过 <span :class="$style.red_text">new Vue(options)</span> 实例化子组件。
无论哪种场景，都会执行实例的 <span :class="$style.red_text">\_init(options)</span> 方法，它首先会执行一个 me
rge options 的逻辑，相关的代码在 src/core/instance/init.js 中：

```js
Vue.prototype._init = function (options?: Object) {
  // merge options
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
};
```

可以看到不同场景对于 options 的合并逻辑是不一样的，并且传入的 options 值也有非常大的不同，接下来我会分开介绍 2 种场景的 options 合并过程。为了更直观，我们可以举个简单的示例：

```js
import Vue from "vue";
let childComp = {
  template: "<div>{{msg}}</div>",
  created() {
    console.log("child created");
  },
  mounted() {
    console.log("child mounted");
  },
  data() {
    return {
      msg: "Hello Vue",
    };
  },
};
Vue.mixin({
  created() {
    console.log("parent created");
  },
});
let app = new Vue({
  el: "#app",
  render: (h) => h(childComp),
});
```

### 外部调用场景

当执行 new Vue 的时候，在执行 <span :class="$style.red_text">this.\_init(options)</span> 的时候，就会执行如下
逻辑去<span :class="$style.red_text">合并 options</span>：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
);
```

这里通过调用 <span :class="$style.red_text">mergeOptions</span> 方法来合并，它实际上就是把 resolveConstructorOptions(vm.constructor) 的返回值和 options 做合并，resolveConstructorOptions
的实现先不考虑，在这个场景下，它还是简单返回 vm.constructor.options，相当于 <span :class="$style.red_text">Vue.options</span>，那么这个值又是什么呢，其实在 <span :class="$style.red_text">initGlobalAPI(Vue)</span>的时候定义了这个值，代码在 src/core/global-api/index.js 中：

```js
export function initGlobalAPI(Vue: GlobalAPI) {
  // ...
  Vue.options = Object.create(null);
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });
  // this is used to identify the "base" constructor to extend all plain - object;
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;
  extend(Vue.options.components, builtInComponents);
  // ...
}
```

首先通过 <span :class="$style.red_text">Vue.options = Object.create(null)</span> 创建一个空对象，然后遍
历 ASSET_TYPES，ASSET_TYPES 的定义在 src/shared/constants.js 中：

```js
export const ASSET_TYPES = ["component", "directive", "filter"];
// 相当于
Vue.options.components = {};
Vue.options.directives = {};
Vue.options.filters = {};
```

接着执行了 <span :class="$style.red_text">Vue.options.\_base = Vue</span>，它的作用在上节实例化子组件的时
候介绍了。<br>
最后通过 <span :class="$style.red_text">extend(Vue.options.components, builtInComponents)</span> 把一些内置组件扩展到 Vue.options.components 上，Vue 的内置组件目前有

```md
<keep-alive>、<transition> 和 <transition-group>
组件， 这也就是为什么我们在其它组件中使用
<keep-alive /> 组件不需要注册的原因，这块儿后续介绍
<keep-alive> 组件的时候会详细讲。
```

那么回到<span :class="$style.red_text">mergeOptions</span>这个函数，它的定义在 <span :class="$style.red_text">src/core/util/options.js</span> 中：

```js
/**
 * 合并两个选项，出现相同配置项时，子选项会覆盖父选项的配置
 */
export function mergeOptions(
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== "production") {
    checkComponents(child);
  }

  if (typeof child === "function") {
    child = child.options;
  }

  // 标准化 props、inject、directive 选项，方便后续程序的处理
  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // 处理原始 child 对象上的 extends 和 mixins，分别执行 mergeOptions，将这些继承而来的选项合并到 parent
  // mergeOptions 处理过的对象会含有 _base 属性
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  const options = {};
  let key;
  // 遍历 父选项
  for (key in parent) {
    mergeField(key);
  }

  // 遍历 子选项，如果父选项不存在该配置，则合并，否则跳过，因为父子拥有同一个属性的情况在上面处理父选项时已经处理过了，用的子选项的值
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }

  // 合并选项，childVal 优先级高于 parentVal
  function mergeField(key) {
    // strat 是合并策略函数，如何 key 冲突，则 childVal 会 覆盖 parentVal
    const strat = strats[key] || defaultStrat;
    // 值为如果 childVal 存在则优先使用 childVal，否则使用 parentVal
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}
```

<span :class="$style.red_text">mergeOptions</span> 主要功能就是把 parent 和 child 这两个对象根据一些合并策略，合并成一个新对象并返回。比较核心的几步，先递归把<span :class="$style.red_text"> extends 和 mixixns 合并到 parent 上</span>，然后遍历 parent，调用 mergeField，然后再遍历 child，如果 key 不在 parent 的自身属性上，则调用 mergeField。<br>
这里有意思的是 mergeField 函数，它对不同的 key 有着不同的合并策略。举
例来说，对于生命周期函数，它的合并策略是这样的：

```js
/**
 * Hooks and props are merged as arrays.
 */
function mergeHook(
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
      ? childVal
      : [childVal]
    : parentVal;
  return res ? dedupeHooks(res) : res;
}

// 这里父子组件合并并不会去重，只有全局钩子函数合并会达到去重效果
function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook;
});

export const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
  "activated",
  "deactivated",
  "errorCaptured",
  "serverPrefetch",
];
```

这里定义了 Vue.js 所有的钩子函数名称，所以对于钩子函数，他们的合并策略都是 <span :class="$style.red_text">mergeHook</span>函数。
这个函数的实现也非常有意思，用了一个多层 3 元运算符，逻辑就是如果不存在 childVal ，就返回 parentVal；否则再判断是否存在 parentVal，如果存在就把 childVal 添加到 parentVal 后返回新数组；否
则返回 childVal 的数组。所以回到 mergeOptions 函数，一旦 parent 和 chi
ld 都定义了相同的钩子函数，那么它们会把 2 个钩子函数合并成一个数组。<br>

因此，在我们当前这个 case 下，执行完如下合并后：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
);
```

<span :class="$style.red_text">vm.$options</span>的内容格式是：

```js
vm.$options = {
  components: {},
  created: [
    function created() {
      console.log("parent created");
    },
  ],
  directives: {},
  filters: {},
  _base: function Vue(options) {
    // ...
  },
  el: "#app",
  render: function (h) {
    //...
  },
};
```

### 组件场景

由于组件的构造函数是通过<span :class="$style.red_text"> Vue.extend </span>继承自 Vue 的，先回顾一下这个过程，代码定义在 <span :class="$style.red_text">src/core/global-api/extend.js</span> 中。

```js
/**
 * Class inheritance
 */
Vue.extend = function (extendOptions: Object): Function {
  // ...
  Sub.options = mergeOptions(Super.options, extendOptions);
  // ...
  // keep a reference to the super options at extension time.
  // later at instantiation we can check if Super's options have
  // been updated.
  Sub.superOptions = Super.options;
  Sub.extendOptions = extendOptions;
  Sub.sealedOptions = extend({}, Sub.options);
  // ...
  return Sub;
};
```

这里只保留关键逻辑，这里的<span :class="$style.red_text"> extendOptions </span>对应的就是前面定义的组件对象，它会和 Vue.options 合并到 Sub.opitons 中。<br>
接下来我们再回忆一下子组件的初始化过程，代码定义在 src/core/vdom/create-component.js 中：

```js
export function createComponentInstanceForVnode(
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent,
  };
  // ...
  return new vnode.componentOptions.Ctor(options);
}
```

这里的 <span :class="$style.red_text">vnode.componentOptions.Ctor</span> 就是指向 <span :class="$style.red_text">Vue.extend</span> 的返回值 Sub， 所
以 执行 <span :class="$style.red_text">new vnode.componentOptions.Ctor(options)</span> 接着执
行 <span :class="$style.red_text">this.\_init(options)</span>，因为 <span :class="$style.red_text">options.\_isComponent</span> 为 true，那么合并 options 的过程走到了 <span :class="$style.red_text">initInternalComponent(vm, options)</span> 逻辑。先来看一下它的代码实现，在 src/core/instance/init.js 中：

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

<span :class="$style.red_text">initInternalComponent</span> 方法首先执行<span :class="$style.red_text"> const opts = vm.$options =
Object.create(vm.constructor.options)</span>，这里的 vm.construction 就是子组件的
构造函数 Sub，相当于<span :class="$style.red_text"> vm.$options = Sub.options</span>。
接着又把实例化子组件传入的<span :class="$style.red_text">子组件父 VNode 实例 parentVnode</span>、<span :class="$style.red_text">子组件的
父 Vue 实例 parent</span> 保存到 vm.$options 中，另外还保留了 parentVnode 配置
中的如 propsData 等其它的属性。
这么看来，initInternalComponent 只是做了简单一层对象赋值，并不涉及到递归、
合并策略等复杂逻辑。

vm.$options 执行 initInternalComponent(vm, options)合并后内容大概是：

```js
vm.$options = {
  parent: Vue /*父 Vue 实例*/,
  propsData: undefined,
  _componentTag: undefined,
  _parentVnode: VNode /*父 VNode 实例*/,
  _renderChildren: undefined,
  __proto__: {
    components: {},
    directives: {},
    filters: {},
    _base: function Vue(options) {
      //...
    },
    _Ctor: {},
    created: [
      function created() {
        console.log("parent created");
      },
      function created() {
        console.log("child created");
      },
    ],
    mounted: [
      function mounted() {
        console.log("child mounted");
      },
    ],
    data() {
      return {
        msg: "Hello Vue",
      };
    },
    template: "<div>{{msg}}</div>",
  },
};
```

> [!TIP]
> Vue 初始化阶段对于 options 的合并过程就介绍完了，我们需要知
> 道对于 options 的合并有 2 种方式，子组件初始化过程通
> 过 initInternalComponent 方式要比外部初始化 Vue 通过 mergeOptions 的过程
> 要快，合并完的结果保留在 vm.$options 中。

## 生命周期

每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如需要设置<span :class="$style.red_text">数据监听、编译模板、挂载实例到 DOM、在数据变化时更新 DOM </span>等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，给予用户机会在一些特定的场景下添加他们自己的代码。<br>

在我们实际项目开发过程中，会非常频繁地和 Vue 组件的生命周期打交道，接
下来我们就从源码的角度来看一下这些生命周期的钩子函数是如何被执行的。
源码中最终执行生命周期的函数都是调用 callHook 方法，它的定义在 src/core/instance/lifecycle 中：

```js
/**
 * callHook(vm, 'mounted')
 * 执行实例指定的生命周期钩子函数
 * 如果实例设置有对应的 Hook Event，比如：<comp @hook:mounted="method" />，执行完生命周期函数之后，触发该事件的执行
 * @param {*} vm 组件实例
 * @param {*} hook 生命周期钩子函数
 */
export function callHook(vm: Component, hook: string) {
  // 打开依赖收集
  pushTarget();
  // 从实例配置对象中获取指定钩子函数，比如 mounted
  const handlers = vm.$options[hook];
  // mounted hook
  const info = `${hook} hook`;
  if (handlers) {
    // 通过 invokeWithErrorHandler 执行生命周期钩子
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  // Hook Event，如果设置了 Hook Event，比如 <comp @hook:mounted="method" />，则通过 $emit 触发该事件
  // vm._hasHookEvent 标识组件是否有 hook event，这是在 vm.$on 中处理组件自定义事件时设置的
  if (vm._hasHookEvent) {
    // vm.$emit('hook:mounted')
    vm.$emit("hook:" + hook);
  }
  // 关闭依赖收集
  popTarget();
}
```

<span :class="$style.common_text">callHook</span> 函数的逻辑很简单，根据传入的字符串 hook，去拿到 <span :class="$style.common_text">vm.$options[hook]</span> 对应的回调函数数组，然后遍历执行，执行的时候把 vm 作为函数执行的上下文。<br>
在上一节中，我们详细地介绍了 Vue.js 合并 options 的过程，各个阶段的生
命周期的函数也被合并到 vm.$options 里，并且是一个数组。因此 <span :class="$style.common_text">callhook</span>
函数的功能就是调用某个生命周期钩子注册的所有回调函数。
了解了生命周期的执行方式后，接下来我们会具体介绍每一个生命周期函数它
的调用时机。

### beforeCreate & created

<span :class="$style.common_text">beforeCreate</span> 和 <span :class="$style.common_text">created</span> 函数都是在实例化 Vue 的阶段，在 \_init 方法中执
行的，它的定义在 src/core/instance/init.js 中：

```js
Vue.prototype._init = function (options?: Object) {
  // ...
  initLifecycle(vm);
  initEvents(vm);
  initRender(vm);
  callHook(vm, "beforeCreate");
  initInjections(vm); // resolve injections before data/props
  initState(vm);
  initProvide(vm); // resolve provide after data/props
  callHook(vm, "created");
  // ...
};
```

可以看到 <span :class="$style.red_text">beforeCreate</span> 和 <span :class="$style.red_text">created</span> 的钩子调用是在 initState 的前后，
initState 的作用是初始化 <span :class="$style.red_text">props</span>、<span :class="$style.red_text">data</span>、<span :class="$style.red_text">methods</span>、<span :class="$style.red_text">watch</span>、<span :class="$style.red_text">computed</span> 等属性，之
后我们会详细分析。那么显然 beforeCreate 的钩子函数中就不能获取到 prop
s、data 中定义的值，也不能调用 methods 中定义的函数。<br>

在这俩个钩子函数执行的时候，并没有渲染 DOM，所以我们也不能够访问 DOM，一般来说，如果组件在加载的时候需要和后端有交互，放在这俩个钩子函数执行都可以，如果是需要访问 props、data 等数据的话，就需要使用 cre
ated 钩子函数。

### beforeMount & mounted

顾名思义，<span :class="$style.red_text">beforeMount</span> 钩子函数发生在 <span :class="$style.red_text">mount</span>，也就是 DOM 挂载之前，它的
调用时机是在<span :class="$style.red_text">mountComponent</span> 函数中，定义在 src/core/instance/lifecycle.js 中：

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // ...
  callHook(vm, 'beforeMount')
  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance &&
  mark) {
  updateComponent = () => {
    const name = vm._name
    const id = vm._uid
    const startTag = `vue-perf-start:${id}`
    const endTag = `vue-perf-end:${id}`
    mark(startTag)
    const vnode = vm._render()
    mark(endTag)
    measure(`vue ${name} render`, startTag, endTag)
    mark(startTag)
    vm._update(vnode, hydrating)
    mark(endTag)
    measure(`vue ${name} patch`, startTag, endTag)
  }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }
  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g.
  inside child
  // component's mounted hook), which relies on vm._watcher being
  already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false
  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its
  inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

在执行<span :class="$style.red_text"> vm.\_render()</span> 函数渲染 VNode 之前，执行了 beforeMount 钩子函数，
在执行完 vm.\_update() 把 <span :class="$style.red_text">VNode patch 到真实 DOM 后</span>，执行 <span :class="$style.red_text"> mouted </span> 钩子。
注意，这里对 mouted 钩子函数执行有一个判断逻辑，<span :class="$style.red_text">vm.$vnode</span> 如果为 nul
l，则表明这不是一次组件的初始化过程，而是我们通过外部 new Vue 初始化
过程。那么对于组件，它的 mounted 时机在哪儿呢？ <br>
组件的 VNode patch 到 DOM 后，会执行 <span :class="$style.red_text">invokeInsertHook</span> 函数，把 insertedVnodeQueue 里保存的钩子函数依次执行
一遍，它的定义在 src/core/vdom/patch.js 中：

```js
function invokeInsertHook(vnode, queue, initial) {
  // delay insert hooks for component root nodes, invoke them after the
  // element is really inserted
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue;
  } else {
    for (let i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i]);
    }
  }
}
```

该函数会执行 insert 这个钩子函数，对于组件而言，insert 钩子函数的定义
在 src/core/vdom/create-component.js 中的 componentVNodeHooks 中：

```js
const componentVNodeHooks = {
  // ...
  insert(vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, "mounted");
    }
    // ...
  },
};
```

我们可以看到，每个子组件都是在这个钩子函数中执行 mouted 钩子函数，并
且我们之前分析过，<span :class="$style.red_text">insertedVnodeQueue</span> 的添加顺序是先子后父，所以对于同步渲染的子组件而言，<span :class="$style.red_text">mounted</span> 钩子函数的执行顺序也是先子后父。

### beforeUpdate & updated

顾名思义，<span :class="$style.red_text">beforeUpdate</span> 和 <span :class="$style.red_text">updated</span> 的钩子函数执行时机都应该是在数据更新
的时候，beforeUpdate 的执行时机是在渲染 Watcher 的 before 函数中，我们刚才提到
过：

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...
  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g.inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  // ...
}
```

注意这里有个判断，也就是在组件已经 mounted 之后，才会去调用这个钩子
函数。<br>
<span :class="$style.red_text">update</span> 的执行时机是在 <span :class="$style.red_text">flushSchedulerQueue</span> 函数调用的时候, 它的定义
在 src/core/observer/scheduler.js 中：

```js
function flushSchedulerQueue() {
  // ...
  // 获取到 updatedQueue
  callUpdatedHooks(updatedQueue);
}
function callUpdatedHooks(queue) {
  let i = queue.length;
  while (i--) {
    const watcher = queue[i];
    const vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, "updated");
    }
  }
}
```

<span :class="$style.red_text">flushSchedulerQueue</span> 函数我们之后会详细介绍，可以先大概了解一下，
<span :class="$style.red_text">updatedQueue</span> 是 更新了的 wathcer 数组，那么在 callUpdatedHooks 函数中，它对这些数组做遍历，只有满足当前 <span :class="$style.red_text">watcher</span> 为 vm.\_watcher 以及组件已经 <span :class="$style.red_text">mounted</span> 这两个条件，才会执行 updated 钩子函数。<br>

我们之前提过，在组件 mount 的过程中，会实例化一个渲染的<span :class="$style.red_text"> Watcher </span> 去监
听 vm 上的数据变化重新渲染，这断逻辑发生在 mountComponent 函数执行的时候：

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...
  // 这里是简写
  let updateComponent = () => {
    vm._update(vm._render(), hydrating);
  };
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted) {
          callHook(vm, "beforeUpdate");
        }
      },
    },
    true /* isRenderWatcher */
  );
  // ...
}
```

那么在实例化 Watcher 的过程中，在它的构造函数里会判断 isRenderWatche
r，接着把当前 watcher 的实例赋值给 vm.\_watcher，定义在 src/core/
observer/watcher.js 中：

```js
export default class Watcher {
  // ...
  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // ...
  }
}
```

同时，还把当前 <span :class="$style.red_text">wathcer</span> 实例 push 到 <span :class="$style.red_text">vm.\_watchers</span> 中，<span :class="$style.red_text">vm.\_watcher</span> 是专门
用来监听 vm 上数据变化然后重新渲染的，所以它是一个<span :class="$style.red_text">渲染相关的 watcher</span>，因此在 <span :class="$style.red_text">callUpdatedHooks</span> 函数中，只有 <span :class="$style.red_text">vm.\_watcher</span> 的回调执行完毕后，才会执行 updated 钩子函数。

### beforeDestroy & destroyed

顾名思义，<span :class="$style.red_text">beforeDestroy</span> 和 <span :class="$style.red_text">destroyed</span> 钩子函数的执行时机在组件销毁的阶段，组件的销毁过程之后会详细介绍，最终会调用 <span :class="$style.red_text">$destroy</span> 方法，它的定义在 src/core/instance/lifecycle.js 中：

```js
/**
 * 完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。
 */
Vue.prototype.$destroy = function () {
  const vm: Component = this;
  if (vm._isBeingDestroyed) {
    // 表示实例已经销毁
    return;
  }
  // 调用 beforeDestroy 钩子
  callHook(vm, "beforeDestroy");
  // 标识实例已经销毁
  vm._isBeingDestroyed = true;
  // 把自己从老爹（$parent)的肚子里（$children）移除
  const parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    remove(parent.$children, vm);
  }
  // 移除依赖监听
  if (vm._watcher) {
    vm._watcher.teardown();
  }
  let i = vm._watchers.length;
  while (i--) {
    vm._watchers[i].teardown();
  }
  // remove reference from data ob
  // frozen object may not have observer.
  if (vm._data.__ob__) {
    vm._data.__ob__.vmCount--;
  }
  // call the last hook...
  vm._isDestroyed = true;
  // 调用 __patch__，销毁节点
  vm.__patch__(vm._vnode, null);
  // 调用 destroyed 钩子
  callHook(vm, "destroyed");
  // 关闭实例的所有事件监听
  vm.$off();
  // remove __vue__ reference
  if (vm.$el) {
    vm.$el.__vue__ = null;
  }
  // release circular reference (#6759)
  if (vm.$vnode) {
    vm.$vnode.parent = null;
  }
};
```

<span :class="$style.red_text">beforeDestroy</span> 钩子函数的执行时机是在 <span :class="$style.red_text">$destroy</span> 函数执行最开始的地方，接
着执行了一系列的销毁动作，包括从 <span :class="$style.red_text">parent</span> 的 <span :class="$style.red_text">$children</span> 中删掉自身，删除watcher，当前渲染的 VNode 执行销毁钩子函数等，执行完毕后再调用 <span :class="$style.red_text">destroy</span> 钩子函数。
在 $destroy 的执行过程中，它又会执行 vm.**patch**(vm.\_vnode, null) 触发
它子组件的销毁钩子函数，这样一层层的递归调用，所以 <span :class="$style.red_text">destroy</span> 钩子函数执行顺序是先子后父，和 mounted 过程一样。

### activated & deactivated

activated 和 deactivated 钩子函数是专门为 keep-alive 组件定制的钩子，这里先做个标记，后面详细介绍

## 组件注册

在 Vue.js 中，除了它内置的组件如 keep-alive、component、transition、transition-group 等，其它用户自定义组件在使
用前必须注册。很多同学在开发过程中可能会遇到如下报错信息：

```md
'Unknown custom element: <xxx> - did you register the component
correctly?
For recursive components, make sure to provide the "name" option.'
```

一般报这个错的原因都是我们使用了未注册的组件。Vue.js 提供了 2 种组件的注册方式，全局注册和局部注册。

### 全局注册

要注册一个全局组件，可以使用 <span :class="$style.red_text">Vue.component(tagName, options)</span>。例如：

```js
Vue.component("my-component", {
  // 选项
});
```

那么，<span :class="$style.red_text">Vue.component</span> 函数是在什么时候定义的呢，它的定义过程发生在最开始
初始化 Vue 的全局函数的时候，代码在 src/core/global-api/assets.js 中：

```js
/* @flow */

import { ASSET_TYPES } from "shared/constants";
import { isPlainObject, validateComponentName } from "../util/index";

export function initAssetRegisters(Vue: GlobalAPI) {
  /**
   * 定义 Vue.component、Vue.filter、Vue.directive 这三个方法
   * 这三个方法所做的事情是类似的，就是在 this.options.xx 上存放对应的配置
   * 比如 Vue.component(compName, {xx}) 结果是 this.options.components.compName = 组件构造函数
   * ASSET_TYPES = ['component', 'directive', 'filter']
   */
  ASSET_TYPES.forEach((type) => {
    /**
     * 比如：Vue.component(name, definition)
     * @param {*} id name
     * @param {*} definition 组件构造函数或者配置对象
     * @returns 返回组件构造函数
     */
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + "s"][id];
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== "production" && type === "component") {
          validateComponentName(id);
        }
        if (type === "component" && isPlainObject(definition)) {
          // 如果组件配置中存在 name，则使用，否则直接使用 id
          definition.name = definition.name || id;
          // extend 就是 Vue.extend，所以这时的 definition 就变成了 组件构造函数，使用时可直接 new Definition()
          definition = this.options._base.extend(definition);
        }
        if (type === "directive" && typeof definition === "function") {
          definition = { bind: definition, update: definition };
        }
        // this.options.components[id] = definition
        // 在实例化时通过 mergeOptions 将全局注册的组件合并到每个组件的配置对象的 components 中
        this.options[type + "s"][id] = definition;
        return definition;
      }
    };
  });
}
```

函数首先遍历 <span :class="$style.red_text">ASSET_TYPES</span>，得到 type 后挂载到 <span :class="$style.red_text">Vue</span> 上 。ASSET_TYPES 的定义在 src/shared/constants.js 中：

```js
export const ASSET_TYPES = ["component", "directive", "filter"];
```

所以实际上 Vue 是初始化了 3 个全局函数，并且如果 type 是 component 且 definition 是一个对象的话，通过 <span :class="$style.red_text">this.opitons.\_base.extend</span>， 相当
于 <span :class="$style.red_text">Vue.extend</span> 把这个对象转换成一个继承于 <span :class="$style.red_text">Vue 的构造函数</span>，最后通过 <span :class="$style.common_text">this.options[type + 's'][id] = definition</span> 把它挂载
到 <span :class="$style.common_text">Vue.options.components</span> 上。<br>
由于每个组件的创建都是通过 Vue.extend 继承而来，我们之前分析过在继承的过程中有这么一段逻辑：

```js
Sub.options = mergeOptions(Super.options, extendOptions);
```

也就是说它会把 <span :class="$style.red_text">Vue.options</span> 合并到 <span :class="$style.red_text">Sub.options</span>，也就是组件的 optinons 上， 然后在组件的实例化阶段，会执行 <span :class="$style.red_text">merge options</span> 逻辑，把 Sub.options.components 合并到 <span :class="$style.red_text">vm.$options.components</span> 上。<br>
然后在创建 vnode 的过程中，会执行 \_createElement 方法，再来回顾一下这部分的逻辑，它的定义在 src/core/vdom/create-element.js 中：

```js
export function _createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // ...
  let vnode, ns;
  if (typeof tag === "string") {
    let Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag),
        data,
        children,
        undefined,
        undefined,
        context
      );
    } else if (
      isDef((Ctor = resolveAsset(context.$options, "components", tag)))
    ) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its;
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  // ...
}
```

这里有一个判断逻辑 <span :class="$style.red_text">isDef(Ctor = resolveAsset(context.$options,
'components', tag))</span>，先来看一下 <span :class="$style.red_text">resolveAsset</span> 的定义，在 src/core/utils/options.js 中：

```js
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset(
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== "string") {
    return;
  }
  const assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id];
  const camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) return assets[camelizedId];
  const PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId];
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== "production" && warnMissing && !res) {
    warn("Failed to resolve " + type.slice(0, -1) + ": " + id, options);
  }
  return res;
}
```

这段逻辑很简单，先通过<span :class="$style.red_text"> const assets = options[type] </span> 拿到 assets，然后再
尝试拿 <span :class="$style.red_text">assets[id]</span>，这里有个顺序，先直接使用 id 拿，如果不存在，则把
id 变成驼峰的形式再拿，如果仍然不存在，则在驼峰的基础上把首字母再变成大
写的形式再拿，如果仍然拿不到则报错。这样说明了我们在使用 <span :class="$style.red_text">Vue.component(id, definition)</span> 全局注册组件的时候，id 可以是连字符、驼峰或首字母大写
的形式。<br>
那么回到我们的调用 <span :class="$style.red_text">resolveAsset(context.$options, 'components', tag)</span>，即
拿 <span :class="$style.red_text">vm.$options.components[tag]</span>，这样就可以在 resolveAsset 的时候拿到
这个组件的构造函数，并作为 createComponent 的钩子的参数。

### 局部注册

Vue.js 也同样支持局部注册，我们可以在一个组件内部使用 <span :class="$style.red_text">components</span> 选项
做组件的局部注册，例如：

```js
import HelloWorld from "./components/HelloWorld";
export default {
  components: {
    HelloWorld,
  },
};
```

其实理解了全局注册的过程，局部注册是非常简单的。在组件的 Vue 的实例化阶段有一个合并 option 的逻辑，之前也分析过，所以就把 components 合
并到 <span :class="$style.red_text">vm.$options.components</span> 上，这样就可以在<span :class="$style.red_text"> resolveAsset </span>的时候拿到这个组件的构造函数，并作为 createComponent 的钩子的参数。<br>
注意，局部注册和全局注册不同的是，只有该类型的组件才可以访问局部注册
的子组件，而全局注册是扩展到 <span :class="$style.red_text">Vue.options</span> 下，所以在所有组件创建的过程
中，都会从全局的<span :class="$style.red_text"> Vue.options.components </span>扩展到当前组件的<span :class="$style.red_text"> vm.$options.components </span>下，这就是全局注册的组件能被任意使用的原因。

## 异步组件

在我们平时的开发工作中，为了减少首屏代码体积，往往会把一些非首屏的组
件设计成异步组件，按需加载。Vue 也原生支持了异步组件的能力，如下：

```js
Vue.component("async-example", function (resolve, reject) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(["./my-async-component"], resolve);
});
```

示例中可以看到，Vue 注册的组件不再是一个对象，而是一个<span :class="$style.red_text">工厂函数</span>，函数有两个参数<span :class="$style.red_text"> resolve 和 reject </span>，函数内部用 setTimout 模拟了异步，实际使
用可能是通过动态请求异步组件的 JS 地址，最终通过执行 resolve 方法，它的参数就是我们的异步组件对象。<br>
上一节分析了组件的注册逻辑，由于组件的定义并不是一个普通对象，所
以不会执行 Vue.extend 的逻辑把它变成一个组件的构造函数，但是它仍然可
以执行到<span :class="$style.red_text"> createComponent </span>函数，再来对这个函数做回顾，它的定义在 s
rc/core/vdom/create-component/js 中：

```js
export function createComponent(
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return;
  }
  const baseCtor = context.$options._base;
  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }
  // ...
  // async component
  let asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }
}
```

省略了不必要的逻辑，只保留关键逻辑，由于我们这个时候传入的 Ctor
是一个函数，那么它也并不会执行 Vue.extend 逻辑，因此它的 cid 是 undefiend，进入了异步组件创建的逻辑。这里首先执行了<span :class="$style.red_text"> Ctor =resolveAsyncComponent(asyncFactory, baseCtor, context) </span>方法，它的定义
在<span :class="$style.red_text"> src/core/vdom/helpers/resolve-async-component.js </span>中：

```js
export function resolveAsyncComponent(
  factory: Function,
  baseCtor: Class<Component>
): Class<Component> | void {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp;
  }

  if (isDef(factory.resolved)) {
    return factory.resolved;
  }

  const owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp;
  }

  if (owner && !isDef(factory.owners)) {
    const owners = (factory.owners = [owner]);
    let sync = true;
    let timerLoading = null;
    let timerTimeout = null;

    (owner: any).$on("hook:destroyed", () => remove(owners, owner));

    const forceRender = (renderCompleted: boolean) => {
      for (let i = 0, l = owners.length; i < l; i++) {
        (owners[i]: any).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    const resolve = once((res: Object | Class<Component>) => {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    const reject = once((reason) => {
      process.env.NODE_ENV !== "production" &&
        warn(
          `Failed to resolve async component: ${String(factory)}` +
            (reason ? `\nReason: ${reason}` : "")
        );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    const res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(() => {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(() => {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== "production"
                  ? `timeout (${res.timeout}ms)`
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading ? factory.loadingComp : factory.resolved;
  }
}
```

<span :class="$style.red_text"> resolveAsyncComponent </span> 函数的逻辑略复杂，因为它实际上处理了 3 种异步组件
的创建方式，除了刚才示例的组件注册方式，还支持 2 种，一种是支
持 Promise 创建组件的方式，如下：

```js
Vue.component(
  "async-webpack-example",
  // 该 `import` 函数返回一个 `Promise` 对象。
  () => import("./my-async-component")
);
```

另一种是高级异步组件，如下：

```js
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import("./MyComp.vue"),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000,
});
Vue.component("async-example", AsyncComp);
```

### 普通函数异步组件

针对普通函数的情况，前面几个 if 判断可以忽略，它们是为高级组件所用，对于 <span :class="$style.red_text"> factory.contexts </span> 的判断，是考虑到多个地方同时初始化一个异步组件，那
么它的实际加载应该只有一次。接着进入实际加载逻辑，定义了 <span :class="$style.common_text"> forceRender、resolve 和 reject </span> 函数，注意 resolve 和 reject 函数用 once 函数做了
一层包装，它的定义在 src/shared/util.js 中：

```js
/**
 * Ensure a function is called only once.
 */
export function once(fn: Function): Function {
  let called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}
```

<span :class="$style.common_text"> once </span>逻辑非常简单，传入一个函数，并返回一个新函数，它非常巧妙地利用闭
包和一个标志位保证了它包装的函数只会执行一次，也就是确保<span :class="$style.common_text"> resolve </span>和<span :class="$style.common_text"> reject </span>函数只执行一次。<br>

接下来执行<span :class="$style.red_text"> const res = factory(resolve, reject) </span> 逻辑，这块儿就是执行我们
组件的工厂函数，同时把<span :class="$style.red_text"> resolve </span>和<span :class="$style.red_text"> reject </span>函数作为参数传入，组件的工厂函数通常会先发送请求去加载我们的异步组件的 JS 文件，拿到组件定义的对象 res 后，执行 resolve(res) 逻辑，它会先执行<span :class="$style.red_text"> factory.resolved = ensureCtor(res, baseCtor) </span>：

```js
function ensureCtor(comp: any, base) {
  if (comp.__esModule || (hasSymbol && comp[Symbol.toStringTag] === "Module")) {
    comp = comp.default;
  }
  return isObject(comp) ? base.extend(comp) : comp;
}
```

这个函数目的是为了保证能找到异步组件 JS 定义的组件对象，并且如果它是
一个普通对象，则调用<span :class="$style.red_text"> Vue.extend </span>把它转换成一个组件的构造函数。<br>
resolve 逻辑最后判断了<span :class="$style.red_text"> sync </span>，显然我们这个场景下 sync 为 false，那么就会执行 forceRender 函数，它会遍历<span :class="$style.red_text"> factory.contexts </span>，拿到每一个调用异步组件的实例 vm, 执行<span :class="$style.red_text"> vm.$forceUpdate() </span> 方法，它的定义在<span :class="$style.red_text"> src/core/instance/lifecycle.js </span> 中：

```js
Vue.prototype.$forceUpdate = function () {
  const vm: Component = this;
  if (vm._watcher) {
    vm._watcher.update();
  }
};
```

<span :class="$style.red_text">$forceUpdate</span> 的逻辑非常简单，就是调用渲染 watcher 的 update 方法，让渲
染 <span :class="$style.red_text">watcher</span> 对应的回调函数执行，也就是触发了组件的重新渲染。之所以这么
做是因为 Vue 通常是数据驱动视图重新渲染，但是在整个异步组件加载过程中
是没有数据发生变化的，所以通过执行<span :class="$style.red_text"> $forceUpdate </span>可以强制组件重新渲染一
次。

### Promise 异步组件

```js
Vue.component(
  "async-webpack-example",
  // 该 `import` 函数返回一个 `Promise` 对象。
  () => import("./my-async-component")
);
```

webpack 2+ 支持了异步加载的语法糖：<span :class="$style.red_text">() => import('./my-async-component')</span>，
当执行完 <span :class="$style.red_text">res = factory(resolve, reject)</span>，返回的值就是<span :class="$style.red_text"> import('./my-async-component') </span> 的返回值，它是一个 <span :class="$style.red_text">Promise</span> 对象。接着进入 if 条件，又判断了<span :class="$style.red_text"> typeof res.then === 'function' </span>，条件满足，执行：

```js
if (isUndef(factory.resolved)) {
  res.then(resolve, reject);
}
```

当组件异步加载成功后，执行<span :class="$style.red_text"> resolve </span>，加载失败则执行<span :class="$style.red_text"> reject </span>，这样就非常巧妙地实现了配合 webpack 2+ 的异步加载组件的方式（<span :class="$style.red_text">Promise</span>）加载异步
组件。

### 高级异步组件

由于异步加载组件需要动态加载 JS，有一定网络延时，而且有加载失败的情
况，所以通常我们在开发异步组件相关逻辑的时候需要设计 loading 组件和
error 组件，并在适当的时机渲染它们。Vue.js 2.3+ 支持了一种高级异步组件
的方式，它通过一个简单的对象配置，帮你搞定 loading 组件和 error 组件的
渲染时机，你完全不用关心细节，非常方便。接下来就从源码的角度来分
析高级异步组件是怎么实现的。

```js
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import("./MyComp.vue"),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000,
});
Vue.component("async-example", AsyncComp);
```

高级异步组件的初始化逻辑和普通异步组件一样，也是执行<span :class="$style.red_text"> resolveAsyncComponent </span>，当执行完<span :class="$style.red_text"> res = factory(resolve, reject) </span>，返回值就是定义的组件对象，显然满足<span :class="$style.red_text"> else if (isDef(res.component) && typeof res.component.then ==='function') </span>的逻辑，接着执行 res.component.then(resolve, reject)，当异步组件加载成功后，执行 resolve，失败执行 reject。<br>

因为异步组件加载是一个异步过程，它接着又同步执行了如下逻辑：

```js
if (isDef(res.error)) {
  factory.errorComp = ensureCtor(res.error, baseCtor);
}
if (isDef(res.loading)) {
  factory.loadingComp = ensureCtor(res.loading, baseCtor);
  if (res.delay === 0) {
    factory.loading = true;
  } else {
    setTimeout(() => {
      if (isUndef(factory.resolved) && isUndef(factory.error)) {
        factory.loading = true;
        forceRender();
      }
    }, res.delay || 200);
  }
}
if (isDef(res.timeout)) {
  setTimeout(() => {
    if (isUndef(factory.resolved)) {
      reject(
        process.env.NODE_ENV !== "production"
          ? `timeout (${res.timeout}ms)`
          : null
      );
    }
  }, res.timeout);
}
```

先判断<span :class="$style.red_text"> res.error </span>是否定义了 error 组件，如果有的话则赋值
给 <span :class="$style.red_text">factory.errorComp</span>。接着判断<span :class="$style.red_text"> res.loading </span> 是否定义了 loading 组件，如果有的话则赋值给 <span :class="$style.red_text">factory.loadingComp</span>，如果设置了 <span :class="$style.red_text">res.delay</span> 且为 0，则设置 <span :class="$style.red_text">factory.loading = true</span>，否则延时 <span :class="$style.red_text">delay</span> 的时间执行：

```js
if (isUndef(factory.resolved) && isUndef(factory.error)) {
  factory.loading = true;
  forceRender();
}
```

最后判断 <span :class="$style.red_text">res.timeout</span>，如果配置了该项，则在 <span :class="$style.red_text">res.timeout</span> 时间后，如果组件没有成功加载，执行<span :class="$style.red_text"> reject </span>。 <br>
在 <span :class="$style.red_text">resolveAsyncComponent</span> 的最后有一段逻辑：

```js
sync = false;
return factory.loading ? factory.loadingComp : factory.resolved;
```

如果 <span :class="$style.red_text">delay</span> 配置为 0，则这次直接渲染 loading 组件，否则则延时 delay 执
行 <span :class="$style.red_text">forceRender</span>，那么又会再一次执行到<span :class="$style.red_text"> resolveAsyncComponent </span>。<br>

下面有几种情况，按逻辑的执行顺序，对不同的情况做判断。

#### 异步组件加载失败

当异步组件加载失败，会执行 reject 函数：

```js
const reject = once((reason) => {
  process.env.NODE_ENV !== "production" &&
    warn(
      `Failed to resolve async component: ${String(factory)}` +
        (reason ? `\nReason: ${reason}` : "")
    );
  if (isDef(factory.errorComp)) {
    factory.error = true;
    forceRender();
  }
});
```

这个时候会把 <span :class="$style.red_text">factory.error</span> 设置为 <span :class="$style.red_text">true</span>，同时执行 <span :class="$style.red_text">forceRender()</span> 再次执行到 <span :class="$style.red_text">resolveAsyncComponent</span>：

```js
if (isTrue(factory.error) && isDef(factory.errorComp)) {
  return factory.errorComp;
}
```

那么这个时候就返回 <span :class="$style.red_text">factory.errorComp</span>，直接渲染 <span :class="$style.red_text">error</span> 组件。

#### 异步组件加载成功

当异步组件加载成功，会执行 resolve 函数：

```js
const resolve = once((res: Object | Class<Component>) => {
  factory.resolved = ensureCtor(res, baseCtor);
  if (!sync) {
    forceRender();
  }
});
```

首先把加载结果缓存到 <span :class="$style.red_text">factory.resolved</span> 中，这个时候因为 sync 已经为
false，则执行 <span :class="$style.red_text">forceRender()</span> 再次执行到<span :class="$style.red_text"> resolveAsyncComponent </span>：

```js
if (isDef(factory.resolved)) {
  return factory.resolved;
}
```

那么这个时候直接返回 <span :class="$style.red_text">factory.resolved</span>，渲染成功加载的组件。

#### 异步组件加载中

如果异步组件加载中并未返回，这时候会走到这个逻辑：

```js
if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
  return factory.loadingComp;
}
```

那么则会返回 factory.loadingComp，渲染 loading 组件。

#### 异步组件加载超时

如果超时，则走到了 reject 逻辑，之后逻辑和加载失败一样，渲染 error 组
件。

#### 异步组件 patch

回到<span :class="$style.red_text"> createComponent </span>的逻辑：

```js
Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
if (Ctor === undefined) {
  return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
}
```

如果是第一次执行<span :class="$style.red_text"> resolveAsyncComponent </span>，除非使用高级异步组件 <span :class="$style.red_text">0 delay</span> 去
创建了一个<span :class="$style.red_text"> loading </span>组件，否则返回是<span :class="$style.red_text"> undefiend </span>，接着通
过<span :class="$style.red_text"> createAsyncPlaceholder </span> 创建一个注释节点作为占位符。它的定义在 src/
core/vdom/helpers/resolve-async-components.js 中：

```js
export function createAsyncPlaceholder(
  factory: Function,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag: ?string
): VNode {
  const node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data, context, children, tag };
  return node;
}
```

实际上就是就是创建了一个占位的注释<span :class="$style.red_text"> VNode </span>，同时把<span :class="$style.red_text"> asyncFactory </span>
和<span :class="$style.red_text"> asyncMeta </span>赋值给当前 vnode。<br>

当执行<span :class="$style.red_text"> forceRender </span>的时候，会触发组件的重新渲染，那么会再一次执行<span :class="$style.red_text"> resolveAsyncComponent </span>，这时候就会根据不同的情况，可能返回 <span :class="$style.red_text">loading</span>、<span :class="$style.red_text">error</span> 或 成功加载的异步组件，返回值不为<span :class="$style.red_text"> undefined </span>，因此就走正常的组件 <span :class="$style.red_text">render、patch</span> 过程，与组件第一次渲染流程不一样，这个时候是存在新旧 vnode 的，下一章分析组件更新的 patch 过程。

::: tip
通过以上代码分析，我们对 Vue 的异步组件的实现有了深入的了解，知道了 3 种异步组件的实现方式，并且看到高级异步组件的实现是非常巧妙的，它实现了<span :class="$style.red_text"> loading、resolve、reject、timeout </span> 4 种状态。异步组件实现的本质是 2
次渲染，除了<span :class="$style.red_text"> 0 delay </span> 的高级异步组件第一次直接渲染成 loading 组件外，其它都是第一次渲染生成一个注释节点，当异步获取组件成功后，再通过<span :class="$style.red_text"> forceRender </span> 强制重新渲染，这样就能正确渲染出我们异步加载的组件了。
:::

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
