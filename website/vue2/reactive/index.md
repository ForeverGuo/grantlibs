## 深入响应式原理

前面 2 章介绍的都是 <span :class="$style.common_text">Vue</span> 怎么实现数据渲染和组件化的，主要讲的是初始化的过程，把原始的数据最终映射到<span :class="$style.common_text"> DOM </span>中，但并没有涉及到数据变化到
<span :class="$style.common_text">DOM</span> 变化的部分。而<span :class="$style.common_text"> Vue </span>的数据驱动除了数据渲染 DOM 之外，还有一个很重要的体现就是<span :class="$style.red_text">数据的变更会触发 DOM 的变化</span>。<br>

其实前端开发最重要的 2 个工作，<span :class="$style.red_text">一个是把数据渲染到页面</span>，<span :class="$style.red_text">另一个是处理用户交互</span>。Vue 把数据渲染到页面的能力我们已经通过源码分析出其中的原理了，
但是由于一些用户交互或者是其它方面导致数据发生变化重新对页面渲染的原
理我们还未分析。<br>
考虑如下示例：

```js
<div id="app" @click="changeMsg">
  {{ message }}
</div>
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    changeMsg() {
      this.message = 'Hello World!'
    }
  }
})
```

当我们去修改<span :class="$style.red_text"> this.message </span> 的时候，模板对应的插值也会渲染成新的数据，那么这一切是怎么做到的呢？<br>
在分析前，我们先直观的想一下，如果不用 Vue 的话，我们会通过最简单的方
法实现这个需求：<span :class="$style.special_text">监听点击事件，修改数据，手动操作 DOM 重新渲染</span>。这个过程和使用 Vue 的最大区别就是多了一步“手动操作 DOM 重新渲染”。这一步看上去并不多，但它背后又潜在的几个要处理的问题：<br>

1. 需要修改哪块的 DOM？
2. 修改效率和性能是不是最优的？
3. 需要对数据每一次的修改都去操作 DOM 吗？
4. 需要 case by case 去写修改 DOM 的逻辑吗？

如果我们使用了<span :class="$style.red_text"> Vue </span>，那么上面几个问题 <span :class="$style.red_text">Vue</span> 内部就帮你做了，那么 <span :class="$style.red_text">Vue</span> 是如何在我们对数据修改后自动做这些事情呢，接下来将进入一些 Vue 响应式系统的底层的细节。

## 响应式对象

可能很多小伙伴之前都了解过<span :class="$style.red_text"> Vue.js </span> 实现响应式的核心是利用了<span :class="$style.red_text"> ES5
的 Object.defineProperty </span>，这也是为什么 Vue.js 不能兼容 IE8 及以下浏览器的原因，我们先来对它有个直观的认识。

### Object.defineProperty

<span :class="$style.red_text">Object.defineProperty</span> 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象，先来看一下它的语法：

```js
Object.defineProperty(obj, prop, descriptor);
```

<span :class="$style.red_text">obj</span> 是要在其上定义属性的对象；<span :class="$style.red_text">prop</span> 是要定义或修改的属性的名称；
<span :class="$style.red_text">descriptor</span> 是将被定义或修改的属性描述符。<br>
比较核心的是 <span :class="$style.red_text">descriptor</span>，它有很多可选键值，具体的可以去参阅它的[文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)。
这里我们最关心的是 <span :class="$style.red_text">get</span> 和 <span :class="$style.red_text">set</span>，get 是一个给属性提供的 getter 方法，当我们访问了该属性的时候会触发 <span :class="$style.red_text">getter</span> 方法；set 是一个给属性提供的 <span :class="$style.red_text">setter
</span>方法，当我们对该属性做修改的时候会触发 setter 方法 <br>

一旦对象拥有了 <span :class="$style.red_text">getter 和 setter</span>，我们可以简单地把这个对象称为响应式对象。那么 Vue.js 把哪些对象变成了响应式对象了呢，接下来从源码层面分析。

### initState

在 Vue 的初始化阶段，<span :class="$style.red_text">\_init</span> 方法执行的时候，会执行 <span :class="$style.red_text">initState(vm)</span> 方法，
它的定义在 <span :class="$style.red_text">src/core/instance/state.js</span>中。

```js
/**
 * 两件事：
 *   数据响应式的入口：分别处理 props、methods、data、computed、watch
 *   优先级：props、methods、data、computed 对象中的属性不能出现重复，优先级和列出顺序一致
 *   其中 computed 中的 key 不能和 props、data 中的 key 重复，methods 不影响
 */
export function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  // 处理 props 对象，为 props 对象的每个属性设置响应式，并将其代理到 vm 实例上
  if (opts.props) initProps(vm, opts.props);
  // 处理 methods 对象，校验每个属性的值是否为函数、和 props 属性比对进行判重处理，最后得到 vm[key] = methods[key]
  if (opts.methods) initMethods(vm, opts.methods);
  /**
   * 做了三件事
   *   1、判重处理，data 对象上的属性不能和 props、methods 对象上的属性相同
   *   2、代理 data 对象上的属性到 vm 实例
   *   3、为 data 对象的上数据设置响应式
   */
  if (opts.data) {
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  /**
   * 做了三件事：
   *   1、为 computed[key] 创建 watcher 实例，默认是懒执行
   *   2、代理 computed[key] 到 vm 实例
   *   3、判重，computed 中的 key 不能和 data、props 中的属性重复
   */
  if (opts.computed) initComputed(vm, opts.computed);
  /**
   * 做了三件事：
   *   1、处理 watch 对象
   *   2、为 每个 watch.key 创建 watcher 实例，key 和 watcher 实例可能是 一对多 的关系
   *   3、如果设置了 immediate，则立即执行 回调函数
   */
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }

  /**
   * 其实到这里也能看出，computed 和 watch 在本质是没有区别的，都是通过 watcher 去实现的响应式
   * 非要说有区别，那也只是在使用方式上的区别，简单来说：
   *   1、watch：适用于当数据变化时执行异步或者开销较大的操作时使用，即需要长时间等待的操作可以放在 watch 中
   *   2、computed：其中可以使用异步方法，但是没有任何意义。所以 computed 更适合做一些同步计算
   */
}
```

<span :class="$style.red_text">initState</span> 方法主要是对<span :class="$style.red_text"> props、methods、data、computed 和 wathcer </span> 等属性做了初始化操作。这里我们重点分析 props 和 data，对于其它属性的初始化我们之后再详细分析。

### initProps

```js
// 处理 props 对象，为 props 对象的每个属性设置响应式，并将其代理到 vm 实例上
function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {};
  const props = (vm._props = {});
  // 缓存 props 的每个 key，性能优化
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = (vm.$options._propKeys = []);
  const isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  // 遍历 props 对象
  for (const key in propsOptions) {
    // 缓存 key
    keys.push(key);
    // 获取 props[key] 的默认值
    const value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      const hyphenatedKey = hyphenate(key);
      if (
        isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)
      ) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        );
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
              `overwritten whenever the parent component re-renders. ` +
              `Instead, use a data or computed property based on the prop's ` +
              `value. Prop being mutated: "${key}"`,
            vm
          );
        }
      });
    } else {
      // 为 props 的每个 key 是设置数据响应式
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      // 代理 key 到 vm 对象上
      proxy(vm, `_props`, key);
    }
  }
  toggleObserving(true);
}
```

<span :class="$style.red_text">props</span> 的初始化主要过程，就是遍历定义的 <span :class="$style.red_text">props</span> 配置。遍历的过程主要做两
件事情：一个是调用<span :class="$style.red_text"> defineReactive </span>方法把每个 prop 对应的值变成响应式，可以通过 vm.\_props.xxx 访问到定义 props 中对应的属性。对于 defineReactive 方法；另一个是通过<span :class="$style.red_text"> proxy </span>把 vm.\_props.xxx 的访问代理到 vm.xxx 上。

### initData

```js
/**
 * 做了三件事
 *   1、判重处理，data 对象上的属性不能和 props、methods 对象上的属性相同
 *   2、代理 data 对象上的属性到 vm 实例
 *   3、为 data 对象的上数据设置响应式
 */
function initData(vm: Component) {
  // 得到 data 对象
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== "production" &&
      warn(
        "data functions should return an object:\n" +
          "https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function",
        vm
      );
  }
  /**
   * 两件事
   *   1、判重处理，data 对象上的属性不能和 props、methods 对象上的属性相同
   *   2、代理 data 对象上的属性到 vm 实例
   */
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (process.env.NODE_ENV !== "production") {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key);
    }
  }
  // 为 data 对象上的数据设置响应式
  observe(data, true /* asRootData */);
}
```

<span :class="$style.red_text">data</span> 的初始化主要过程也是做两件事，一个是对定义 data 函数返回对象的遍历，通过 <span :class="$style.red_text">proxy</span> 把每一个值 <span :class="$style.red_text">vm.\_data.xxx</span> 都代理到<span :class="$style.red_text"> vm.xxx </span>上；另一个是调用<span :class="$style.red_text"> observe </span>方法观测整个<span :class="$style.red_text"> data </span>的变化，把 data 也变成响应式，可以通过 vm.\_data.xxx 访问到定义 data 返回函数中对应的属性。 <br>

可以看到，无论是<span :class="$style.red_text"> props </span> 或 <span :class="$style.red_text"> data </span>的初始化都是把它们变成响应式对象，这
个过程我们接触到几个函数，接下来我们来详细分析它们。

## 依赖收集

## 派发更新

## nextTick

## 检测变化的注意事项

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
