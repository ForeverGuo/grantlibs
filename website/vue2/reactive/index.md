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

### proxy

首先介绍一下代理，代理的作用是把 <span :class="$style.red_text">props</span> 和 <span :class="$style.red_text">data</span> 上的属性代理到 <span :class="$style.red_text">vm</span> 实
例上，这也就是为什么比如我们定义了如下 props，却可以通过 vm 实例访问
到它。

```js
let comP = {
  props: {
    msg: "hello",
  },
  methods: {
    say() {
      console.log(this.msg);
    },
  },
};
```

我们可以在 <span :class="$style.red_text">say</span> 函数中通过 <span :class="$style.red_text">this.msg</span> 访问到我们定义在 <span :class="$style.red_text">props</span> 中的 <span :class="$style.red_text">msg</span>，这个过程发生在 <span :class="$style.red_text">proxy</span> 阶段：

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

// 设置代理，将 key 代理到 target 上
export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

<span :class="$style.red_text">proxy</span> 方法的实现很简单，通过<span :class="$style.red_text"> Object.defineProperty </span> 把<span :class="$style.red_text"> target[sourceKey][key] </span> 的读写变成了对 target[key] 的读写。所以对于 props 而言，对 <span :class="$style.common_text">vm.\_props.xxx 的读写变成了 vm.xxx 的读写</span>，而对于 vm.\_props.xxx 我们可以访问到定义在 props 中的属性，所以我们就可以通过 vm.xxx 访问到定义在 props 中的 xxx 属性了。同理，对于 data 而言，<span :class="$style.common_text">对 vm.\_data.xxxx 的读写变成了对 vm.xxxx 的读写</span>，而对于 vm.\_data.xxxx 我们可以访问到定义在 data 函数返回
对象中的属性，所以我们就可以通过 vm.xxxx 访问到定义在 data 函数返回对象中的 xxxx 属性了。

### observe

<span :class="$style.red_text">observe</span> 的功能就是用来监测数据的变化，它的定义在<span :class="$style.red_text"> src/core/observer/index.js </span> 中：

```js
/**
 * 响应式处理的真正入口
 * 为对象创建观察者实例，如果对象已经被观察过，则返回已有的观察者实例，否则创建新的观察者实例
 * @param {*} value 对象 => {}
 */
export function observe(value: any, asRootData: ?boolean): Observer | void {
  // 非对象和 VNode 实例不做响应式处理
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob: Observer | void;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    // 如果 value 对象上存在 __ob__ 属性，则表示已经做过观察了，直接返回  属性
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 创建观察者实例
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

<span :class="$style.red_text">observe</span> 方法的作用就是给非 VNode 的对象类型数据添加一个<span :class="$style.red_text"> Observer </span>，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 Observer 对象实例。接下来我们来看一下<span :class="$style.red_text"> Observer </span> 的作用。

### Observer

<span :class="$style.red_text">Observer</span> 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖
收集和派发更新：

```js
/**
 * 观察者类，会被附加到每个被观察的对象上，value.__ob__ = this
 * 而对象的各个属性则会被转换成 getter/setter，并收集依赖和通知更新
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value;
    // 实例化一个 dep
    this.dep = new Dep();
    this.vmCount = 0;
    // 在 value 对象上设置 __ob__ 属性
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      /**
       * value 为数组
       * hasProto = '__proto__' in {}
       * 用于判断对象是否存在 __proto__ 属性，通过 obj.__proto__ 可以访问对象的原型链
       * 但由于 __proto__ 不是标准属性，所以有些浏览器不支持，比如 IE6-10，Opera10.1
       * 为什么要判断，是因为一会儿要通过 __proto__ 操作数据的原型链
       * 覆盖数组默认的七个原型方法，以实现数组响应式
       */
      if (hasProto) {
        // 有 __proto__
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      // value 为对象，为对象的每个属性（包括嵌套对象）设置响应式
      this.walk(value);
    }
  }

  /**
   * 遍历对象上的每个 key，为每个 key 设置响应式
   * 仅当值为对象时才会走这里
   */
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  /**
   * 遍历数组，为数组的每一项设置观察，处理数组元素为对象的情况
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

<span :class="$style.red_text">Observer</span> 的构造函数逻辑很简单，首先实例化<span :class="$style.red_text"> Dep </span>对象，这块稍后会介绍，接着通过执行 def 函数把<span :class="$style.red_text">自身实例</span>添加到数据对象 value 的 **ob** 属性上，def 的定义在 src/core/util/lang.js 中：

```js
/**
 * Define a property.
 */
export function def(obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}
```

<span :class="$style.red_text">def</span> 函数是一个非常简单的<span :class="$style.red_text"> Object.defineProperty </span> 的封装，这就是为什么我在开发中输出<span :class="$style.red_text"> data </span>上对象类型的数据，会发现该对象多了一个原型 ob 的属性。<br>
回到 <span :class="$style.red_text">Observer</span> 的构造函数，接下来会对 value 做判断，对于数组会调用<span :class="$style.red_text"> observeArray </span>方法，否则对纯对象调用 walk 方法。可以看到 observeArray 是遍
历数组再次调用 observe 方法，而 walk 方法是遍历对象的 key 调
用<span :class="$style.red_text"> defineReactive </span>方法，下面看一下这个方法是做什么的。

### defineReactive

<span :class="$style.red_text">defineReactive</span> 的功能就是定义一个响应式对象，给对象动态添加<span :class="$style.red_text"> getter </span> 和 <span :class="$style.red_text"> setter </span>，它的定义在 <span :class="$style.red_text"> src/core/observer/index.js </span> 中：

```js
/**
 * 拦截 obj[key] 的读取和设置操作：
 *   1、在第一次读取时收集依赖，比如执行 render 函数生成虚拟 DOM 时会有读取操作
 *   2、在更新时设置新值并通知依赖更新
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 实例化 dep，一个 key 一个 dep
  const dep = new Dep();

  // 获取 obj[key] 的属性描述符，发现它是不可配置对象的话直接 return
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // 记录 getter 和 setter，获取 val 值
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  // 递归调用，处理 val 即 obj[key] 的值为对象的情况，保证对象中的所有 key 都被观察
  // shallow 不为true的情况 执行 observer  默认深度观察
  let childOb = !shallow && observe(val);
  // 响应式核心
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // get 拦截对 obj[key] 的读取操作
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      /**
       * Dep.target 为 Dep 类的一个静态属性，值为 watcher，在实例化 Watcher 时会被设置
       * 实例化 Watcher 时会执行 new Watcher 时传递的回调函数（computed 除外，因为它懒执行）
       * 而回调函数中如果有 vm.key 的读取行为，则会触发这里的 读取 拦截，进行依赖收集
       * 回调函数执行完以后又会将 Dep.target 设置为 null，避免这里重复收集依赖
       */
      if (Dep.target) {
        // 依赖收集，在 dep 中添加 watcher，也在 watcher 中添加 dep
        dep.depend();
        // childOb 表示对象中嵌套对象的观察者对象，如果存在也对其进行依赖收集
        if (childOb) {
          // 这就是 this.key.chidlKey 被更新时能触发响应式更新的原因
          childOb.dep.depend();
          // 如果是 obj[key] 是 数组，则触发数组响应式
          if (Array.isArray(value)) {
            // 为数组项为对象的项添加依赖
            dependArray(value);
          }
        }
      }
      return value;
    },
    // set 拦截对 obj[key] 的设置操作
    set: function reactiveSetter(newVal) {
      // 旧的 obj[key]
      const value = getter ? getter.call(obj) : val;
      // 如果新老值一样，则直接 return，不跟新更不触发响应式更新过程
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      // setter 不存在说明该属性是一个只读属性，直接 return
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      // 设置新值
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      // 对新值进行观察，让新值也是响应式的
      childOb = !shallow && observe(newVal);
      // 依赖通知更新
      dep.notify();
    },
  });
}
```

defineReactive 函数最开始初始化 Dep 对象的实例，接着拿到 obj 的属性描述
符，然后对子对象递归调用 observe 方法，这样就保证了无论 obj 的结构多
复杂，它的所有子属性也能变成响应式的对象，这样我们访问或修改 obj 中一
个嵌套较深的属性，也能触发 getter 和 setter。最后利
用 Object.defineProperty 去给 obj 的属性 key 添加 getter 和 setter。而关
于 getter 和 setter 的具体实现，我们会在之后介绍。

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
