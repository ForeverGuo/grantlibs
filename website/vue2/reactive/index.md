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

<span :class="$style.red_text">defineReactive</span> 函数最开始初始化 Dep 对象的实例，接着拿到 obj 的属性描述符，然后对子对象递归调用 observe 方法，这样就保证了无论 obj 的结构多复杂，它的所有子属性也能变成响应式的对象，这样我们访问或修改 obj 中一个嵌套较深的属性，也能触发 <span :class="$style.red_text">getter</span> 和 <span :class="$style.red_text">setter</span>。最后利用<span :class="$style.red_text"> Object.defineProperty </span>去给 obj 的属性 key 添加 <span :class="$style.red_text">getter</span>和 <span :class="$style.red_text">setter</span>。而关于 getter 和 setter 的具体实现，会在之后介绍。

:::tip

1.  响应式对象的核心是利用 Object.defineProperty 给对象的属性添加 getter 和 setter。

2.  Vue 会把 props，data 等变成响应式对象，在创建过程中，发现子属性也为对象则递归把该对象变成响应式。

:::

## 依赖收集

上面有讲到 <span :class="$style.red_text">defineReactive </span>函数执行，其中关于依赖收集的部分有两个地方，一个是<span :class="$style.red_text"> const dep = new Dep() </span> 实例化一个 Dep 的实例，另一个是在 get 函数中通过<span :class="$style.red_text"> dep.depend </span> 做依赖收集。

### Dep

Dep 是整个 getter 依赖收集的核心，它的定义在<span :class="$style.red_text"> src/core/observer/dep.js </span> 中：

```js
/**
 * 一个 dep 对应一个 obj.key
 * 在读取响应式数据时，负责收集依赖，每个 dep（或者说 obj.key）依赖的 watcher 有哪些
 * 在响应式数据更新时，负责通知 dep 中那些 watcher 去执行 update 方法
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  // 在 dep 中添加 watcher
  addSub(sub: Watcher) {
    this.subs.push(sub);
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }

  //  向watcher 中添加 dep
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  /**
   * 通知 dep 中的所有 watcher，执行 watcher.update() 方法
   */
  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    if (process.env.NODE_ENV !== "production" && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id);
    }
    // 遍历 dep 中存储的 watcher，执行 watcher.update()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}
```

<span :class="$style.red_text">Dep</span> 是一个 Class，它定义了一些属性和方法，这里需要特别注意的是它有一个静态属性 <span :class="$style.red_text">target</span>，这是一个全局唯一 <span :class="$style.red_text">Watcher</span>，这是一个非常巧妙的设计，因为在同一时间只能有一个全局的<span :class="$style.red_text"> Watcher </span> 被计算，另外它的自身属性 <span :class="$style.red_text">subs</span> 也是 <span :class="$style.red_text">Watcher</span> 的数组。<br>

<span :class="$style.red_text">Dep</span> 实际上就是对 <span :class="$style.red_text">Watcher</span> 的一种管理，<span :class="$style.red_text">Dep</span> 脱离 <span :class="$style.red_text">Watcher</span> 单独存在是没有意义的，为了完整地讲清楚依赖收集过程，有必要看一下 Watcher 的一些相关实现，它的定义在 src/core/observer/watcher.js 中：

```js
/**
 * 一个组件一个 watcher（渲染 watcher）或者一个表达式一个 watcher（用户watcher）
 * 当数据更新时 watcher 会被触发，访问 this.computedProperty 时也会触发 watcher
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

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
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.expression =
      process.env.NODE_ENV !== "production" ? expOrFn.toString() : "";
    // parse expression for getter
    if (typeof expOrFn === "function") {
      this.getter = expOrFn;
    } else {
      // this.getter = function() { return this.xx }
      // 在 this.get 中执行 this.getter 时会触发依赖收集
      // 待后续 this.xx 更新时就会触发响应式
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
        process.env.NODE_ENV !== "production" &&
          warn(
            `Failed watching path: "${expOrFn}" ` +
              "Watcher only accepts simple dot-delimited paths. " +
              "For full control, use a function instead.",
            vm
          );
      }
    }
    this.value = this.lazy ? undefined : this.get();
  }

  /**
   * 执行 this.getter，并重新收集依赖
   * this.getter 是实例化 watcher 时传递的第二个参数，一个函数或者字符串，比如：updateComponent 或者 parsePath 返回的读取 this.xx 属性值的函数
   * 为什么要重新收集依赖？
   *   因为触发更新说明有响应式数据被更新了，但是被更新的数据虽然已经经过 observe 观察了，但是却没有进行依赖收集，
   *   所以，在更新页面时，会重新执行一次 render 函数，执行期间会触发读取操作，这时候进行依赖收集
   */
  get() {
    // 打开 Dep.target，Dep.target = this
    pushTarget(this);
    // value 为回调函数执行的结果
    let value;
    const vm = this.vm;
    try {
      // 执行回调函数，比如 updateComponent，进入 patch 阶段
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`);
      } else {
        throw e;
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      // 关闭 Dep.target，Dep.target = null
      popTarget();
      this.cleanupDeps();
    }
    return value;
  }

  /**
   * Add a dependency to this directive.
   * 两件事：
   *   1、添加 dep 给自己（watcher）
   *   2、添加自己（watcher）到 dep
   */
  addDep(dep: Dep) {
    // 判重，如果 dep 已经存在则不重复添加
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      // 缓存 dep.id，用于判重
      this.newDepIds.add(id);
      // 添加 dep
      this.newDeps.push(dep);
      // 避免在 dep 中重复添加 watcher，this.depIds 的设置在 cleanupDeps 方法中
      if (!this.depIds.has(id)) {
        // 添加 watcher 自己到 dep
        dep.addSub(this);
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps() {
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    let tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  }

  // ...
}
```

<span :class="$style.red_text">Watcher</span> 是一个 <span :class="$style.red_text">Class</span>，在它的构造函数中，定义了一些和 <span :class="$style.red_text">Dep</span> 相关的属性：

```js
this.deps = [];
this.newDeps = [];
this.depIds = new Set();
this.newDepIds = new Set();
```

### 过程分析

之前我们介绍当对数据对象的访问会触发他们的 getter 方法，那么这些对象什
么时候被访问呢？还记得之前我们介绍过 Vue 的 mount 过程是通
过 <span :class="$style.red_text">mountComponent</span> 函数，其中有一段比较重要的逻辑，大致如下：

```js
updateComponent = () => {
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
```

当我们去实例化一个渲染<span :class="$style.red_text"> watcher </span> 的时候，首先进入<span :class="$style.red_text"> watcher </span>的构造函数逻辑，然后会执行它的<span :class="$style.red_text"> this.get() </span> 方法，进入 get 函数，首先会执行：

```js
pushTarget(this);
```

<span :class="$style.red_text">pushTarget</span> 的定义在<span :class="$style.red_text"> src/core/observer/dep.js </span> 中：

```js
export function pushTarget(_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}
```

实际上就是把 <span :class="$style.red_text">Dep.target</span> 赋值为当前的渲染 watcher 并压栈（为了恢复用）。
接着又执行了：

```js
value = this.getter.call(vm, vm);
```

<span :class="$style.red_text">this.getter</span> 对应就是 <span :class="$style.red_text">updateComponent</span> 函数，这实际上就是在执行：

```js
vm._update(vm._render(), hydrating);
```

它会先执行 <span :class="$style.red_text">vm.\_render()</span> 方法，因为之前分析过这个方法会生成 渲染 VNode，并且在这个过程中会对 <span :class="$style.red_text">vm</span> 上的<span :class="$style.red_text">数据访问</span>，这个时候就触发了数据对象的 getter。<br>
那么每个对象值的<span :class="$style.red_text"> getter </span>都持有一个 <span :class="$style.red_text">dep</span>，在触发 getter 的时候会调
用<span :class="$style.red_text"> dep.depend() </span>方法，也就会执行 <span :class="$style.red_text">Dep.target.addDep(this)</span>。<br>

刚才提到这个时候<span :class="$style.red_text"> Dep.target </span> 已经被赋值为<span :class="$style.red_text">渲染 watcher </span>，那么就执行
到<span :class="$style.red_text"> addDep </span>方法：

```js
addDep (dep: Dep) {
  const id = dep.id
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id)
    this.newDeps.push(dep)
    if (!this.depIds.has(id)) {
      dep.addSub(this)
    }
  }
}
```

这时候会做一些逻辑判断（保证同一数据不会被添加多次）后执行 <span :class="$style.red_text">dep.addSub
(this)</span>，那么就会执行<span :class="$style.red_text"> this.subs.push(sub)</span>，也就是说把当前的 <span :class="$style.red_text">watcher</span> 订阅到这个数据持有的<span :class="$style.red_text"> dep </span>的 <span :class="$style.red_text">subs</span> 中，这个目的是为后续数据变化时候能通知到哪些 <span :class="$style.red_text">subs</span> 做准备。<br>

所以在 <span :class="$style.red_text">vm.\_render()</span> 过程中，会触发所有数据的 <span :class="$style.red_text">getter</span>，这样实际上已经完成
了一个<span :class="$style.red_text">依赖收集</span>的过程。那么到这里就结束了么，其实并没有，再完成依赖收
集后，还有几个逻辑要执行，首先是：

```js
if (this.deep) {
  traverse(value);
}
```

这个是要递归去访问 <span :class="$style.red_text">value</span>，触发它所有子项的 <span :class="$style.red_text">getter</span>，这个之后会详细讲。接下来执行：

```js
popTarget();
```

<span :class="$style.red_text">popTarget</span> 的定义在 <span :class="$style.red_text">src/core/observer/dep.js</span> 中：

```js
Dep.target = targetStack.pop();
```

实际上就是把 <span :class="$style.red_text">Dep.target</span> 恢复成上一个状态，因为当前 <span :class="$style.red_text">vm</span> 的数据依赖收集已经完成，那么对应的渲染 <span :class="$style.red_text">Dep.target</span> 也需要改变。最后执行：

```js
this.cleanupDeps();
```

其实很多人都分析过并了解到<span :class="$style.red_text"> Vue </span> 有依赖收集的过程，但几乎没有看到有人
分析依赖清空的过程，其实这是大部分同学会忽视的一点，也是 Vue 考虑特别细的一点。

```js
/**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
```

考虑到 <span :class="$style.red_text">Vue</span> 是数据驱动的，所以每次数据变化都会重新 <span :class="$style.red_text">render</span>，那么 <span :class="$style.red_text">vm.\_render()</span> 方法又会再次执行，并再次触发数据的<span :class="$style.red_text"> getters </span>，所以 <span :class="$style.red_text">Wathcer</span> 在构造函数中会初始化 2 个 Dep 实例数组，<span :class="$style.red_text">newDeps</span> 表示新添加的 Dep 实例数组，而 <span :class="$style.red_text">deps</span> 表示上一次添加的 Dep 实例数组。<br>

在执行 <span :class="$style.red_text">cleanupDeps</span> 函数的时候，会首先遍历 <span :class="$style.red_text">deps</span>，移除对 <span :class="$style.red_text">dep</span> 的订阅，然
后把 <span :class="$style.red_text">newDepIds</span> 和 <span :class="$style.red_text">depIds</span> 交换，<span :class="$style.red_text">newDeps</span> 和 <span :class="$style.red_text">deps</span> 交换，并把<span :class="$style.red_text"> newDepIds 和 newDeps </span> 清空。<br>

那么为什么需要做 <span :class="$style.red_text">deps</span> 订阅的移除呢，在添加 <span :class="$style.red_text">deps</span> 的订阅过程，已经能通过 id 去重避免重复订阅了。<br>

考虑到一种场景，我们的模板会根据 <span :class="$style.red_text">v-if</span> 去渲染不同子模板 a 和 b，当我们
满足某种条件的时候渲染 a 的时候，会访问到 a 中的数据，这时候我们对 a
使用的数据添加了<span :class="$style.red_text"> getter </span>，做了依赖收集，那么当我们去修改 a 的数据的时候，
理应通知到这些订阅者。那么如果我们一旦改变了条件渲染了 b 模板，又会对 b 使用的数据添加了 getter，如果我们没有依赖移除的过程，那么这时候我去修改 a 模板的数据，会通知 a 数据的订阅的回调，这显然是有浪费的。<br>

因此 <span :class="$style.red_text">Vue</span> 设计了在每次添加完新的订阅，会移除掉旧的订阅，这样就保证了在
我们刚才的场景中，如果渲染 b 模板的时候去修改 a 模板的数据，a 数据订阅回调已经被移除了，所以不会有任何浪费。

::: tip
通过这一节的分析，我们对 Vue 数据的依赖收集过程已经有了认识，并且对这
其中的一些细节做了分析。收集依赖的目的是为了当这些响应式数据发送变化，
触发它们的 setter 的时候，能知道应该通知哪些订阅者去做相应的逻辑处理，
这个过程叫派发更新，其实 <span :class="$style.red_text">Watcher</span> 和 <span :class="$style.red_text">Dep</span> 就是一个非常经典的<span :class="$style.common_text">观察者设计模式</span>的实现。
:::

## 派发更新

通过上一节分析我们了解了响应式数据依赖收集过程，收集的目的就是为了当我们修改数据的时候，可以对相关的依赖派发更新，那么这一节我们来详细分析这个过程。<br>
先来回顾一下 <span :class="$style.red_text">setter</span> 部分的逻辑：

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep();
  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }
  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }
  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // ...
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    },
  });
}
```

<span :class="$style.red_text">setter</span> 的逻辑有 2 个关键的点，一个是 <span :class="$style.red_text">childOb = !shallow &&observe(newVal) </span>，如果 shallow 为 false 的情况，会对新设置的值变成一个响应式对象；另一个是 <span :class="$style.red_text">dep.notify()</span>，通知所有的订阅者，这是本节的关键，接
下来完整的分析整个派发更新的过程。

### 过程分析

当我们在组件中对响应的数据做了修改，就会触发 <span :class="$style.red_text">setter</span> 的逻辑，最后调
用 <span :class="$style.red_text">dep.notify()</span> 方法，它是 Dep 的一个实例方法，定义在<span :class="$style.red_text">src/core/observer/dep.js</span> 中：

```js
class Dep {
  // ...
  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}
```

这里的逻辑非常简单，遍历所有的 <span :class="$style.red_text">subs</span>，也就是 <span :class="$style.red_text">Watcher</span> 的实例数组，然后调用每一个 watcher 的 update 方法，它的定义在 <span :class="$style.red_text">src/core/observer/watcher.js</span> 中：

```js
class Watcher {
// ...
/**
   * 根据 watcher 配置项，决定接下来怎么走，一般是 queueWatcher
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      // 懒执行时走这里，比如 computed
      // 将 dirty 置为 true，可以让 computedGetter 执行时重新计算 computed 回调函数的执行结果
      this.dirty = true
    } else if (this.sync) {
      // 同步执行，在使用 vm.$watch 或者 watch 选项时可以传一个 sync 选项，
      // 当为 true 时在数据更新时该 watcher 就不走异步更新队列，直接执行 this.run
      // 方法进行更新
      // 这个属性在官方文档中没有出现
      this.run()
    } else {
      // 更新时一般都这里，将 watcher 放入 watcher 队列
      queueWatcher(this)
    }
  }
```

这里更新一般走 queueWatcher(this)，先分析这个逻辑，<span :class="$style.red_text">queueWatcher</span> 的定义在 <span :class="$style.red_text">src/core/observer/scheduler.js</span> 中：

```js
const queue: Array<Watcher> = [];
const activatedChildren: Array<Component> = [];
let has: { [key: number]: ?true } = {};
let circular: { [key: number]: number } = {};
let waiting = false;
let flushing = false;
let index = 0;
/**
 * 将 watcher 放入 watcher 队列
 */
export function queueWatcher(watcher: Watcher) {
  const id = watcher.id;
  // 如果 watcher 已经存在，则跳过，不会重复入队
  if (has[id] == null) {
    // 缓存 watcher.id，用于判断 watcher 是否已经入队
    has[id] = true;
    if (!flushing) {
      // 当前没有处于刷新队列状态，watcher 直接入队
      queue.push(watcher);
    } else {
      // 已经在刷新队列了
      // 从队列末尾开始倒序遍历，根据当前 watcher.id 找到它大于的 watcher.id 的位置，然后将自己插入到该位置之后的下一个位置
      // 即将当前 watcher 放入已排序的队列中，且队列仍是有序的
      let i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (process.env.NODE_ENV !== "production" && !config.async) {
        // 直接刷新调度队列
        // 一般不会走这儿，Vue 默认是异步执行，如果改为同步执行，性能会大打折扣
        flushSchedulerQueue();
        return;
      }
      /**
       * 熟悉的 nextTick => vm.$nextTick、Vue.nextTick
       *   1、将 回调函数（flushSchedulerQueue） 放入 callbacks 数组
       *   2、通过 pending 控制向浏览器任务队列中添加 flushCallbacks 函数
       */
      nextTick(flushSchedulerQueue);
    }
  }
}
```

这里引入了一个<span :class="$style.red_text">队列</span>的概念，这也是 <span :class="$style.red_text">Vue</span> 在做派发更新的时候的一个优化的点，它并不会每次数据改变都触发 watcher 的回调，而是把这些 watcher 先添加
到一个队列里，然后在 <span :class="$style.red_text">nextTick</span> 后执行 <span :class="$style.red_text">flushSchedulerQueue</span>。<br>
这里有几个细节要注意一下，首先用 <span :class="$style.red_text">has</span> 对象保证同一个 <span :class="$style.red_text">Watcher</span> 只添加一次；接着对 flushing 的判断，else 部分的逻辑稍后我会讲；最后通过 wating 保证对 <span :class="$style.red_text">nextTick(flushSchedulerQueue)</span> 的调用逻辑只有一次，另外 <span :class="$style.red_text">nextTick</span> 的实现我之后会抽一小节专门去讲，目前就可以理解它是在下一个
tick，也就是异步的去执行 flushSchedulerQueue。<br>
接下来我们来看 flushSchedulerQueue 的实现，它的定义在 <span :class="$style.red_text">src/core/observer/scheduler.js</span> 中。

```js
/**
 * Flush both queues and run the watchers.
 * 刷新队列，由 flushCallbacks 函数负责调用，主要做了如下两件事：
 *   1、更新 flushing 为 ture，表示正在刷新队列，在此期间往队列中 push 新的 watcher 时需要特殊处理（将其放在队列的合适位置）
 *   2、按照队列中的 watcher.id 从小到大排序，保证先创建的 watcher 先执行，也配合 第一步
 *   3、遍历 watcher 队列，依次执行 watcher.before、watcher.run，并清除缓存的 watcher
 */
function flushSchedulerQueue() {
  currentFlushTimestamp = getNow();
  // 标志现在正在刷新队列
  flushing = true;
  let watcher, id;

  /**
   * 刷新队列之前先给队列排序（升序），可以保证：
   *   1、组件的更新顺序为从父级到子级，因为父组件总是在子组件之前被创建
   *   2、一个组件的用户 watcher 在其渲染 watcher 之前被执行，因为用户 watcher 先于 渲染 watcher 创建
   *   3、如果一个组件在其父组件的 watcher 执行期间被销毁，则它的 watcher 可以被跳过
   * 排序以后在刷新队列期间新进来的 watcher 也会按顺序放入队列的合适位置
   */
  queue.sort((a, b) => a.id - b.id);

  // 这里直接使用了 queue.length，动态计算队列的长度，没有缓存长度，是因为在执行现有 watcher 期间队列中可能会被 push 进新的 watcher
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    // 执行 before 钩子，在使用 vm.$watch 或者 watch 选项时可以通过配置项（options.before）传递
    if (watcher.before) {
      watcher.before();
    }
    // 将缓存的 watcher 清除
    id = watcher.id;
    has[id] = null;

    // 执行 watcher.run，最终触发更新函数，比如 updateComponent 或者 获取 this.xx（xx 为用户 watch 的第二个参数），当然第二个参数也有可能是一个函数，那就直接执行
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== "production" && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          "You may have an infinite update loop " +
            (watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`),
          watcher.vm
        );
        break;
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice();
  const updatedQueue = queue.slice();

  /**
   * 重置调度状态：
   *   1、重置 has 缓存对象，has = {}
   *   2、waiting = flushing = false，表示刷新队列结束
   *     waiting = flushing = false，表示可以像 callbacks 数组中放入新的 flushSchedulerQueue 函数，并且可以向浏览器的任务队列放入下一个 flushCallbacks 函数了
   */
  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit("flush");
  }
}
```

这里有几个重要的逻辑要梳理一下，对于一些分支逻辑如 keep-alive 组件相
关和之前提到过的 updated 钩子函数的执行会略过。

- 队列排序
  <span :class="$style.red_text">queue.sort((a, b) => a.id - b.id)</span> 对队列做了从小到大的排序，这么做主要确保以下几点：

  1. 组件的更新由父到子；因为父组件的创建过程是先于子的，所以 watcher 的
     创建也是先父后子，执行顺序也应该保持先父后子。

  2. 用户的自定义 <span :class="$style.red_text">watcher</span> 要优先于渲染 <span :class="$style.red_text">watcher</span> 执行；因为用户自定义 <span :class="$style.red_text">watcher</span> 是在渲染 watcher 之前创建的。

  3. 如果一个组件在父组件的 watcher 执行期间被销毁，那么它对应的 watcher
     执行都可以被跳过，所以父组件的 watcher 应该先执行。

- 队列遍历

  在对 <span :class="$style.red_text">queue</span> 排序后，接着就是要对它做遍历，拿到对应的 <span :class="$style.red_text">watcher</span>，执行 watcher.run()。这里需要注意一个细节，在遍历的时候每次都会对 queue.length 求值，因为在 watcher.run() 的时候，很可能用户会再次添加新的 watcher，
  这样会再次执行到 <span :class="$style.red_text">queueWatcher</span>，如下：

```js
export function queueWatcher(watcher: Watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // ...
  }
}
```

可以看到，这时候 <span :class="$style.red_text">flushing</span> 为 true，就会执行到 else 的逻辑，然后就会从后
往前找，找到第一个待插入 <span :class="$style.red_text">watcher</span> 的 id 比当前队列中 watcher 的 id 大的
位置。把 <span :class="$style.red_text">watcher</span> 按照 <span :class="$style.red_text">id</span>插入到队列中，因此 queue 的长度发生了变化。

- 状态恢复
  这个过程就是执行 <span :class="$style.red_text">resetSchedulerState</span> 函数，它的定义在 <span :class="$style.red_text">src/core/observer/scheduler.js</span> 中。

```js
/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== "production") {
    circular = {};
  }
  waiting = flushing = false;
}
```

逻辑就是把这些控制流程状态的一些变量恢复到初始值，把 <span :class="$style.red_text">watcher</span> 队列清空。

```js
/**
   * 由 刷新队列函数 flushSchedulerQueue 调用，如果是同步 watch，则由 this.update 直接调用，完成如下几件事：
   *   1、执行实例化 watcher 传递的第二个参数，updateComponent 或者 获取 this.xx 的一个函数(parsePath 返回的函数)
   *   2、更新旧值为新值
   *   3、执行实例化 watcher 时传递的第三个参数，比如用户 watcher 的回调函数
   */
  run () {
    if (this.active) {
      // 调用 this.get 方法
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // 更新旧值为新值
        const oldValue = this.value
        this.value = value

        if (this.user) {
          // 如果是用户 watcher，则执行用户传递的第三个参数 —— 回调函数，参数为 val 和 oldVal
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          // 渲染 watcher，this.cb = noop，一个空函数
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
```

通过 <span :class="$style.red_text">this.get()</span> 得到它当前的值，然后做判断，如果满足新旧值不等、新值是对象类型、deep 模式任何一个条件，则执行 <span :class="$style.red_text">watcher</span> 的回调，注意回调函数执行的时候会把第一个和第二个参数传入<span :class="$style.red_text">新值 value</span> 和<span :class="$style.red_text">旧值 oldValue</span>，这就是当我们添加自定义 watcher 的时候能在回
调函数的参数中拿到新旧值的原因。<br>
那么对于渲染 <span :class="$style.red_text">watcher</span> 而言，它在执行 <span :class="$style.red_text">this.get()</span> 方法求值的时候，会执行 <span :class="$style.red_text">getter</span> 方法：

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating);
};
```

这就是当我们去修改组件相关的响应式数据的时候，会触发组件重新渲染
的原因，接着就会重新执行 <span :class="$style.red_text">patch</span> 的过程，但它和首次渲染有所不同。

## nextTick

<span :class="$style.red_text">nextTick</span> 是 Vue 的一个核心实现，在介绍 Vue 的 nextTick 之前，为了方便大
家理解，先简单介绍一下 JS 的运行机制。

### JS 运行机制

JS 执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个步骤：

1. 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
2. 主线程之外，还存在一个<span :class="$style.red_text">"任务队列"（task queue）</span>。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
3. 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步。

主线程的执行过程就是一个<span :class="$style.red_text"> tick </span>，而所有的异步结果都是通过 “任务队列” 来调度被调度。 消息队列中存放的是一个个的任务（task）。 规范中规定 task 分为两大类，分别是<span :class="$style.red_text"> macro task </span> 和<span :class="$style.red_text"> micro task </span>，并且每个 macro task 结束后，都要清空所有的 micro task。<br>
关于 macro task 和 micro task 的概念，简单通过一段代码演示他们的执行顺序：

```js
for (macroTask of macroTaskQueue) {
  // 1. Handle current MACRO-TASK
  handleMacroTask();
  // 2. Handle all MICRO-TASK
  for (microTask of microTaskQueue) {
    handleMicroTask(microTask);
  }
}
```

在浏览器环境中，常见的 macro task 有 setTimeout、MessageChannel、postMessage、setImmediate；常见的
micro task 有 MutationObsever 和 Promise.then。

### Vue 的实现

它的源码并不多，总共也就 100 多行。接下来我们来看一下它的实现，
在 <span :class="$style.red_text">src/core/util/next-tick.js</span> 中：

```js
/**
 * 做了三件事：
 *   1、将 pending 置为 false
 *   2、清空 callbacks 数组
 *   3、执行 callbacks 数组中的每一个函数（flushSchedulerQueue）
 */
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  // 遍历 callbacks 数组，执行其中存储的每个 flushSchedulerQueue 函数
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

let timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== "undefined" && isNative(Promise)) {
  const p = Promise.resolve();
  // 首选 Promise.resolve().then()
  timerFunc = () => {
    // 在 微任务队列 中放入 flushCallbacks 函数
    p.then(flushCallbacks);
    /**
     * 在有问题的UIWebViews中，Promise.then不会完全中断，但是它可能会陷入怪异的状态，
     * 在这种状态下，回调被推入微任务队列，但队列没有被刷新，直到浏览器需要执行其他工作，例如处理一个计时器。
     * 因此，我们可以通过添加空计时器来“强制”刷新微任务队列。
     */
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== "undefined" &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === "[object MutationObserverConstructor]")
) {
  // MutationObserver 次之
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  // 再就是 setImmediate，它其实已经是一个宏任务了，但仍然比 setTimeout 要好
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 最后没办法，则使用 setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

/**
 * 完成两件事：
 *   1、用 try catch 包装 flushSchedulerQueue 函数，然后将其放入 callbacks 数组
 *   2、如果 pending 为 false，表示现在浏览器的任务队列中没有 flushCallbacks 函数
 *     如果 pending 为 true，则表示浏览器的任务队列中已经被放入了 flushCallbacks 函数，
 *     待执行 flushCallbacks 函数时，pending 会被再次置为 false，表示下一个 flushCallbacks 函数可以进入
 *     浏览器的任务队列了
 * pending 的作用：保证在同一时刻，浏览器的任务队列中只有一个 flushCallbacks 函数
 * @param {*} cb 接收一个回调函数 => flushSchedulerQueue
 * @param {*} ctx 上下文
 * @returns
 */
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;
  // 用 callbacks 数组存储经过包装的 cb 函数
  callbacks.push(() => {
    if (cb) {
      // 用 try catch 包装回调函数，便于错误捕获
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    // 执行 timerFunc，在浏览器的任务队列中（首选微任务队列）放入 flushCallbacks 函数
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```

这里的任务队列 timerFunc 首选是 <span :class="$style.red_text">Promise</span> ，然后是 <span :class="$style.red_text">MutationObserver</span>，其次是 <span :class="$style.red_text">setImmediate（其实是一个宏任务）</span>，最后是 <span :class="$style.red_text">setTimeout</span> <br>
<span :class="$style.red_text">next-tick.js</span> 对外暴露 <span :class="$style.red_text">nextTick(flushSchedulerQueue)</span> 所用到的函数。它的逻辑也很简单，把传入的回调函数 cb 压入 callbacks 数组，最后一次性地执行 timerFunc ，而它们都会在下一个 <span :class="$style.red_text">tick</span> 执行 <span :class="$style.red_text">flushCallbacks</span>，flushCallbacks 的逻辑非常简单，对 callbacks 遍历，然后执行相应的回调函数。<br>

这里使用 callbacks 而不是直接在 nextTick 中执行回调函数的原因是保证在
同一个 tick 内多次执行 <span :class="$style.red_text">nextTick</span>，不会开启多个异步任务，而把这些异步任
务都压成一个<span :class="$style.red_text">同步任务</span>，在下一个 <span :class="$style.red_text">tick</span> 执行完毕。<br>

<span :class="$style.red_text">nextTick</span> 函数最后还有一段逻辑：

```js
if (!cb && typeof Promise !== "undefined") {
  return new Promise((resolve) => {
    _resolve = resolve;
  });
}
```

这是当 <span :class="$style.red_text">nextTick</span> 不传 cb 参数的时候，提供一个 Promise 化的调用，比如：

```js
nextTick().then(() => {});
```

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
