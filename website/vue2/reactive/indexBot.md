## 计算属性 vs 侦听属性

<span :class="$style.red_text">Vue</span> 的组件对象支持了计算属性 <span :class="$style.red_text">computed</span> 和侦听属性 <span :class="$style.red_text">watch</span> 2 个选项，很多
同学不了解什么时候该用 <span :class="$style.red_text">computed</span> 什么时候该用 <span :class="$style.red_text">watch</span>。先不回答这个问题，我们接下来从源码实现的角度来分析它们两者有什么区别。

### computed

计算属性的初始化是发生在 Vue 实例初始化阶段的 <span :class="$style.red_text">initState</span> 函数中，执行
了 <span :class="$style.red_text">if (opts.computed) initComputed(vm, opts.computed)</span>，<span :class="$style.red_text">initComputed</span> 的定义在 <span :class="$style.red_text">src/core/instance/state.js</span> 中：

```js
const computedWatcherOptions = { lazy: true };

/**
 * 三件事：
 *   1、为 computed[key] 创建 watcher 实例，默认是懒执行
 *   2、代理 computed[key] 到 vm 实例
 *   3、判重，computed 中的 key 不能和 data、props 中的属性重复
 * @param {*} computed = {
 *   key1: function() { return xx },
 *   key2: {
 *     get: function() { return xx },
 *     set: function(val) {}
 *   }
 * }
 */
function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  const isSSR = isServerRendering();

  // 遍历 computed 对象
  for (const key in computed) {
    // 获取 key 对应的值，即 getter 函数
    const userDef = computed[key];
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    if (process.env.NODE_ENV !== "production" && getter == null) {
      warn(`Getter is missing for computed property "${key}".`, vm);
    }

    if (!isSSR) {
      // 为 computed 属性创建 watcher 实例
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        // 配置项，computed 默认是懒执行
        computedWatcherOptions
      );
    }

    if (!(key in vm)) {
      // 代理 computed 对象中的属性到 vm 实例
      // 这样就可以使用 vm.computedKey 访问计算属性
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== "production") {
      // 非生产环境有一个判重处理，computed 对象中的属性不能和 data、props 中的属性相同
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(
          `The computed property "${key}" is already defined as a prop.`,
          vm
        );
      }
    }
  }
}
```

函数首先创建 <span :class="$style.red_text">vm.\_computedWatchers</span> 为一个空对象，接着对 <span :class="$style.red_text">computed</span> 对象做遍历，拿到计算属性的每一个 <span :class="$style.red_text">userDef</span>，然后尝试获取这个 <span :class="$style.red_text">userDef</span>对应的 <span :class="$style.red_text">getter</span> 函数，拿不到则在开发环境下报警告。接下来为每一个 <span :class="$style.red_text">getter</span> 创建一个 <span :class="$style.red_text">watcher</span>，这个 watcher 和渲染 watcher 有一点很大的不同，它是一个 computed watcher，因为 const computedWatcherOptions = { computed:
true }。<span :class="$style.red_text">computed watcher</span> 和 <span :class="$style.red_text">普通 watcher</span> 的差别我稍后会介绍。最后对判断如果 key 不是 vm 的属性，则调用 <span :class="$style.red_text">defineComputed(vm, key, userDef)</span>，否则判断计算属性对于的 key 是否已经被 data 或者 prop 所占用，如果是的话则在开发环境报相应的警告。<br>

那么接下来需要重点关注 <span :class="$style.red_text">defineComputed</span> 的实现：

```js
/**
 * 代理 computed 对象中的 key 到 target（vm）上
 */
export function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering();
  // 构造属性描述符(get、set)
  if (typeof userDef === "function") {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (
    process.env.NODE_ENV !== "production" &&
    sharedPropertyDefinition.set === noop
  ) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      );
    };
  }
  // 拦截对 target.key 的访问和设置
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

这段逻辑很简单，其实就是利用 <span :class="$style.red_text">Object.defineProperty</span> 给计算属性对应的 key 值添加 <span :class="$style.red_text">getter</span> 和 <span :class="$style.red_text">setter</span>，<span :class="$style.red_text">setter</span> 通常是计算属性是一个对象，并且拥有 set 方法的时候才有，否则是一个空函数。在平时的开发场景中，计算属性有
setter 的情况比较少，我们重点关注一下 getter 部分，缓存的配置也先忽略，最终 <span :class="$style.red_text">getter</span> 对应的是 <span :class="$style.red_text">createComputedGetter(key)</span> 的返回值，来看一下它的定义：

```js
/**
 * @returns 返回一个函数，这个函数在访问 vm.computedProperty 时会被执行，然后返回执行结果
 */
function createComputedGetter(key) {
  // computed 属性值会缓存的原理也是在这里结合 watcher.dirty、watcher.evalaute、watcher.update 实现的
  return function computedGetter() {
    // 得到当前 key 对应的 watcher
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      // 计算 key 对应的值，通过执行 computed.key 的回调函数来得到
      // watcher.dirty 属性就是大家常说的 computed 计算结果会缓存的原理
      // <template>
      //   <div>{{ computedProperty }}</div>
      //   <div>{{ computedProperty }}</div>
      // </template>
      // 像这种情况下，在页面的一次渲染中，两个 dom 中的 computedProperty 只有第一个
      // 会执行 computed.computedProperty 的回调函数计算实际的值，
      // 即执行 watcher.evalaute，而第二个就不走计算过程了，
      // 因为上一次执行 watcher.evalute 时把 watcher.dirty 置为了 false，
      // 待页面更新后，wathcer.update 方法会将 watcher.dirty 重新置为 true，
      // 供下次页面更新时重新计算 computed.key 的结果
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
```

<span :class="$style.red_text">createComputedGetter</span> 返回一个函数 <span :class="$style.red_text">computedGetter</span>，它就是计算属性对应的 <span :class="$style.red_text">getter</span> <br>
整个计算属性的初始化过程到此结束，我们知道计算属性是一个 <span :class="$style.red_text">computed
watcher </span>，它和普通的 <span :class="$style.red_text">watcher</span> 有什么区别呢，为了更加直观，接下来来我们来通过一个例子来分析 <span :class="$style.red_text">computed watcher</span> 的实现。

```js
var vm = new Vue({
  data: {
    firstName: "Foo",
    lastName: "Bar",
  },
  computed: {
    fullName: function () {
      return this.firstName + " " + this.lastName;
    },
  },
});
```

当初始化这个 <span :class="$style.red_text">computed watcher</span> 实例的时候，构造函数部分逻辑稍有不同：

```js
constructor (
vm: Component,
expOrFn: string | Function,
cb: Function,
options?: ?Object,
isRenderWatcher?: boolean
) {
  // ...
  if (this.computed) {
    this.value = undefined
    this.dep = new Dep()
  } else {
    this.value = this.get()
  }
}
```

可以发现 <span :class="$style.red_text">computed watcher</span> 并不会立刻求值，同时持有一个 <span :class="$style.red_text">dep</span> 实例。
然后当我们的 <span :class="$style.red_text">render</span> 函数执行访问到 <span :class="$style.red_text">this.fullName</span> 的时候，就触发了计算
属性的 <span :class="$style.red_text">getter</span>，它会拿到计算属性对应的 watcher，然后执行 <span :class="$style.red_text">watcher.depend()</span>，来看一下它的定义：

```js
depend () {
  if (this.dep && Dep.target) {
    this.dep.depend()
  }
}
```

注意，这时候的 <span :class="$style.red_text">Dep.target</span> 是渲染 watcher，所以 <span :class="$style.red_text">this.dep.depend()</span> 相当于<span :class="$style.red_text">渲染 watcher</span> 订阅了这个 <span :class="$style.red_text">computed watcher</span> 的变化。
然后再执行 <span :class="$style.red_text">watcher.evaluate()</span> 去求值，来看一下它的定义：

```js
evaluate () {
  if (this.dirty) {
    this.value = this.get()
    this.dirty = false
  }
  return this.value
}
```

<span :class="$style.red_text">evaluate</span> 的逻辑非常简单，判断 <span :class="$style.red_text">this.dirty</span>，如果为 <span :class="$style.red_text">true</span> 则通过 <span :class="$style.red_text">this.get()</span>求值，然后把 this.dirty 设置为 false。在求值过程中，会执行<span :class="$style.red_text"> value = this.getter.call(vm, vm)</span>，这实际上就是执行了计算属性定义的 <span :class="$style.red_text">getter</span> 函数，在我们这个例子就是执行了 return this.firstName + ' ' + this.lastName。<br>
这里需要特别注意的是，由于 <span :class="$style.red_text">this.firstName</span> 和 <span :class="$style.red_text">this.lastName</span> 都是响应式对
象，这里会触发它们的 <span :class="$style.red_text">getter</span>，根据我们之前的分析，它们会把自身持有的 <span :class="$style.red_text">dep</span> 添加到当前正在<span :class="$style.red_text">计算的 watcher</span> 中，这个时候 Dep.target 就是这个 <span :class="$style.red_text">computed watcher</span>。<br>
最后通过 <span :class="$style.red_text">return this.value</span> 拿到计算属性对应的值
一旦我们对计算属性依赖的数据做修改，则会触发 <span :class="$style.red_text">setter</span> 过程，通知所有订阅它变化的 <span :class="$style.red_text">watcher</span> 更新，执行 <span :class="$style.red_text">watcher.update()</span> 方法：

```js
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

### watch

侦听属性的初始化也是发生在 <span :class="$style.red_text">Vue</span> 的实例初始化阶段的 <span :class="$style.red_text">initState</span> 函数中，在 <span :class="$style.red_text">computed</span> 初始化之后，执行了：

```js
/**
 * 做了三件事：
 *   1、处理 watch 对象
 *   2、为 每个 watch.key 创建 watcher 实例，key 和 watcher 实例可能是 一对多 的关系
 *   3、如果设置了 immediate，则立即执行 回调函数
 */
if (opts.watch && opts.watch !== nativeWatch) {
  initWatch(vm, opts.watch);
}
```

来看一下 <span :class="$style.red_text">initWatch</span> 的实现，它的定义在 <span :class="$style.red_text">src/core/instance/state.js</span> 中：

```js
function initWatch(vm: Component, watch: Object) {
  // 遍历 watch 对象
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      // handler 为数组，遍历数组，获取其中的每一项，然后调用 createWatcher
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}
```

这里就是对 <span :class="$style.red_text">watch</span> 对象做遍历，拿到每一个 <span :class="$style.red_text">handler</span>，因为 <span :class="$style.red_text">Vue</span> 是支
持 <span :class="$style.red_text">watch</span> 的同一个 key 对应多个 <span :class="$style.red_text">handler</span>，所以如果 handler 是一个数组，则遍历这个数组，调用 <span :class="$style.red_text">createWatcher</span> 方法，否则直接调用 <span :class="$style.red_text">createWatcher</span>：

```js
/**
 * 两件事：
 *   1、兼容性处理，保证 handler 肯定是一个函数
 *   2、调用 $watch
 * @returns
 */
function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  // 如果 handler 为对象，则获取其中的 handler 选项的值
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  // 如果 hander 为字符串，则说明是一个 methods 方法，获取 vm[handler]
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);
}
```

这里的逻辑也很简单，首先对 <span :class="$style.red_text">handler</span> 的类型做判断，拿到它最终的回调函数，
最后调用 <span :class="$style.red_text">vm.$watch(keyOrFn, handler, options)</span> 函数，<span :class="$style.red_text">$watch</span> 是 Vue 原型上的方法，它是在执行 <span :class="$style.red_text">stateMixin</span> 的时候定义的：

```js
/**
 * 创建 watcher，返回 unwatch，共完成如下 5 件事：
 *   1、兼容性处理，保证最后 new Watcher 时的 cb 为函数
 *   2、标示用户 watcher
 *   3、创建 watcher 实例
 *   4、如果设置了 immediate，则立即执行一次 cb
 *   5、返回 unwatch
 * @param {*} expOrFn key
 * @param {*} cb 回调函数
 * @param {*} options 配置项，用户直接调用 this.$watch 时可能会传递一个 配置项
 * @returns 返回 unwatch 函数，用于取消 watch 监听
 */
Vue.prototype.$watch = function (
  expOrFn: string | Function,
  cb: any,
  options?: Object
): Function {
  const vm: Component = this;
  // 兼容性处理，因为用户调用 vm.$watch 时设置的 cb 可能是对象
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options);
  }
  // options.user 表示用户 watcher，还有渲染 watcher，即 updateComponent 方法中实例化的 watcher
  options = options || {};
  options.user = true;
  // 创建 watcher
  const watcher = new Watcher(vm, expOrFn, cb, options);
  // 如果用户设置了 immediate 为 true，则立即执行一次回调函数
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value);
    } catch (error) {
      handleError(
        error,
        vm,
        `callback for immediate watcher "${watcher.expression}"`
      );
    }
  }
  // 返回一个 unwatch 函数，用于解除监听
  return function unwatchFn() {
    watcher.teardown();
  };
};
```

也就是说，侦听属性 <span :class="$style.red_text">watch</span> 最终会调用 <span :class="$style.red_text">$watch</span> 方法，这个方法首先判断 <span :class="$style.red_text">cb</span> 如果是一个对象，则调用 <span :class="$style.red_text">createWatcher</span> 方法，这是因为 <span :class="$style.red_text">$watch</span> 方法是用户可以直接调用的，它可以传递一个对象，也可以传递函数。接着执行 <span :class="$style.red_text">const watcher = new Watcher(vm, expOrFn, cb, options)</span> 实例化了一个 watcher，这里需要注意一点这是一个 <span :class="$style.red_text">user watcher</span>，因为 <span :class="$style.red_text">options.user = true</span>。通过实例化 <span :class="$style.red_text">watcher</span> 的方式，一旦我们 watch 的数据发送变化，它最终会执行 watcher 的 run 方法，执行回调函数 cb，并且如果我们设置了 <span :class="$style.red_text">immediate</span> 为 <span :class="$style.red_text">true</span>，则直接会执行回调函数 cb。最后返回了一个 <span :class="$style.red_text">unwatchFn</span> 方法，它会调用 <span :class="$style.red_text">teardown</span> 方法去移除这个 <span :class="$style.red_text">watcher</span>。<br>
所以本质上侦听属性也是基于 <span :class="$style.red_text">Watcher</span> 实现的，它是一个 <span :class="$style.red_text">user watcher</span>。其实 Watcher 支持了不同的类型，下面我们梳理一下它有哪些类型以及它们的作用。

### Watcher options

<span :class="$style.red_text">Watcher</span> 的构造函数对 <span :class="$style.red_text">options</span> 做的处理，代码如下：

```js
if (options) {
  this.deep = !!options.deep;
  this.user = !!options.user;
  this.computed = !!options.computed;
  this.sync = !!options.sync;
  // ...
} else {
  this.deep = this.user = this.computed = this.sync = false;
}
```

### deep watcher

通常，如果我们想对一下对象做深度观测的时候，需要设置这个属性为 true，
考虑到这种情况：

```js
var vm = new Vue({
  data() {
    a: {
      b: 1;
    }
  },
  watch: {
    a: {
      handler(newVal) {
        console.log(newVal);
      },
    },
  },
});
vm.a.b = 2;
```

这个时候是不会 log 任何数据的，因为我们是 watch 了 <span :class="$style.red_text">a</span> 对象，只触发
了 a 的 getter，并没有触发 <span :class="$style.red_text">a.b</span> 的 getter，所以并没有订阅它的变化，导致
我们对 <span :class="$style.red_text">vm.a.b = 2</span> 赋值的时候，虽然触发了 <span :class="$style.red_text">setter</span>，但没有可通知的对象，所以也并不会触发 <span :class="$style.red_text">watch</span> 的回调函数了。<br>
而我们只需要对代码做稍稍修改，就可以观测到这个变化了.

```js
watch: {
  a: {
    deep: true,
    handler(newVal) {
      console.log(newVal)
    }
  }
}
```

这样就创建了一个 <span :class="$style.red_text">deep watcher</span> 了，在 <span :class="$style.red_text">watcher</span> 执行 <span :class="$style.red_text">get</span> 求值的过程中有一段逻辑：

```js
get() {
  let value = this.getter.call(vm, vm)
  // ...
  if (this.deep) {
    traverse(value)
  }
}
```

在对 <span :class="$style.red_text">watch</span> 的表达式或者函数求值后，会调用 <span :class="$style.red_text">traverse</span> 函数，它的定义
在 src/core/observer/traverse.js 中：

```js
function _traverse(val: any, seen: SimpleSet) {
  let i, keys;
  const isA = Array.isArray(val);
  if (
    (!isA && !isObject(val)) ||
    Object.isFrozen(val) ||
    val instanceof VNode
  ) {
    return;
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) _traverse(val[i], seen);
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) _traverse(val[keys[i]], seen);
  }
}
```

<span :class="$style.red_text">traverse</span> 的逻辑也很简单，它实际上就是对一个对象做深层递归遍历，因为遍
历过程中就是对一个子对象的访问，会触发它们的 <span :class="$style.red_text">getter</span> 过程，这样就可以收
集到依赖，也就是订阅它们变化的 <span :class="$style.red_text">watcher</span>，这个函数实现还有一个小的优化，
遍历过程中会把子响应式对象通过它们的 <span :class="$style.red_text">dep id</span> 记录到 <span :class="$style.red_text">seenObjects</span>，避免
以后重复访问。<br>
那么在执行了 traverse 后，我们再对 watch 的对象内部任何一个值做修改，
也会调用 watcher 的回调函数了。<br>
对 deep watcher 的理解非常重要，今后工作中如果大家观测了一个<span :class="$style.red_text">复杂对象</span>，
并且会改变对象内部深层某个值的时候也希望触发回调，一定要设置 <span :class="$style.red_text">deep 为
true</span>，但是因为设置了 deep 后会执行 <span :class="$style.red_text">traverse</span> 函数，会有一定的性能开销，所以一定要根据应用场景权衡是否要开启这个配置。

### user watcher

通过 <span :class="$style.red_text">vm.$watch</span> 创建的 <span :class="$style.red_text">watcher</span> 是一个 <span :class="$style.red_text">user watcher</span>，其实它的功能很简单，在对 <span :class="$style.red_text">watcher</span> 求值以及在执行回调函数的时候，会处理一下错误，

```js
// 创建 watcher
const watcher = new Watcher(vm, expOrFn, cb, options);
// 如果用户设置了 immediate 为 true，则立即执行一次回调函数
if (options.immediate) {
  try {
    cb.call(vm, watcher.value);
  } catch (error) {
    handleError(
      error,
      vm,
      `callback for immediate watcher "${watcher.expression}"`
    );
  }
}
```

### computed watcher

计算属性刚刚已经讨论过了～

### sync watcher

在我们之前对 <span :class="$style.red_text">setter</span> 的分析过程知道，当响应式数据发送变化后，触发了 <span :class="$style.red_text">watcher.update()</span>，只是把这个 <span :class="$style.red_text">watcher</span> 推送到一个队列中，在 <span :class="$style.red_text">nextTick</span> 后才
会真正执行 <span :class="$style.red_text">watcher</span> 的回调函数。而一旦我们设置了 sync，就可以在<span :class="$style.red_text">当前 Tick 中同步执行 watcher</span> 的回调函数。<br>

只有当我们需要 watch 的值的变化到执行 watcher 的回调函数是一个同步过
程的时候才会去设置该属性为 true。

## 组件更新

在组件化章节，我们介绍了 <span :class="$style.red_text">Vue</span> 的组件化实现过程，不过只讲了 Vue 组
件的创建过程，并没有涉及到组件数据发生变化，更新组件的过程。而通过我们这一章对数据响应式原理的分析，了解到当数据发生变化的时候，会触发渲染 <span :class="$style.red_text">watcher</span> 的回调函数，进而执行组件的更新过程，接下来详细分析这一过程。

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

组件的更新还是调用了<span :class="$style.red_text"> vm.\_update </span> 方法，再回顾一下这个方法，它的定
义在 <span :class="$style.red_text">src/core/instance/lifecycle.js</span> 中：

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this;
  // ...
  const prevVnode = vm._vnode;
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
  // ...
};
```

组件更新的过程，会执行 <span :class="$style.red_text">vm.$el = vm.__patch__(prevVnode, vnode)</span>，它仍然会调用 <span :class="$style.red_text">patch</span> 函数，在 <span :class="$style.red_text">src/core/vdom/patch.js</span> 中定义：

```js
/**
 * vm.__patch__
 *   1、新节点不存在，老节点存在，调用 destroy，销毁老节点
 *   2、如果 oldVnode 是真实元素，则表示首次渲染，创建新节点，并插入 body，然后移除老节点
 *   3、如果 oldVnode 不是真实元素，则表示更新阶段，执行 patchVnode
 */
function patch(oldVnode, vnode, hydrating, removeOnly) {
  // 如果新节点不存在，老节点存在，则调用 destroy，销毁老节点
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
    return;
  }

  let isInitialPatch = false;
  const insertedVnodeQueue = [];

  if (isUndef(oldVnode)) {
    // 新的 VNode 存在，老的 VNode 不存在，这种情况会在一个组件初次渲染的时候出现，比如：
    // <div id="app"><comp></comp></div>
    // 这里的 comp 组件初次渲染时就会走这儿
    // empty mount (likely as component), create new root element
    isInitialPatch = true;
    createElm(vnode, insertedVnodeQueue);
  } else {
    // 判断 oldVnode 是否为真实元素
    const isRealElement = isDef(oldVnode.nodeType);
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // 不是真实元素，但是老节点和新节点是同一个节点，则是更新阶段，执行 patch 更新节点
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
    } else {
      // 是真实元素，则表示初次渲染
      if (isRealElement) {
        // 挂载到真实元素以及处理服务端渲染的情况
        // mounting to a real element
        // check if this is server-rendered content and if we can perform
        // a successful hydration.
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          oldVnode.removeAttribute(SSR_ATTR);
          hydrating = true;
        }
        if (isTrue(hydrating)) {
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
            invokeInsertHook(vnode, insertedVnodeQueue, true);
            return oldVnode;
          } else if (process.env.NODE_ENV !== "production") {
            warn(
              "The client-side rendered virtual DOM tree is not matching " +
                "server-rendered content. This is likely caused by incorrect " +
                "HTML markup, for example nesting block-level elements inside " +
                "<p>, or missing <tbody>. Bailing hydration and performing " +
                "full client-side render."
            );
          }
        }
        // 走到这儿说明不是服务端渲染，或者 hydration 失败，则根据 oldVnode 创建一个 vnode 节点
        // either not server-rendered, or hydration failed.
        // create an empty node and replace it
        oldVnode = emptyNodeAt(oldVnode);
      }

      // 拿到老节点的真实元素
      const oldElm = oldVnode.elm;
      // 获取老节点的父元素，即 body
      const parentElm = nodeOps.parentNode(oldElm);

      // 基于 vnode 创建整棵节点树并插入到 body 元素下
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      );

      // 递归更新父占位符节点元素
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent;
        const patchable = isPatchable(vnode);
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor);
          }
          ancestor.elm = vnode.elm;
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor);
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            const insert = ancestor.data.hook.insert;
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]();
              }
            }
          } else {
            registerRef(ancestor);
          }
          ancestor = ancestor.parent;
        }
      }

      // 移除老节点
      if (isDef(parentElm)) {
        removeVnodes([oldVnode], 0, 0);
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode);
      }
    }
  }

  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
  return vnode.elm;
}
```

这里执行 <span :class="$style.red_text">patch</span> 的逻辑和首次渲染是不一样的，因为 <span :class="$style.red_text">oldVnode</span> 不为空，并且
它和 <span :class="$style.red_text">vnode</span> 都是 VNode 类型，接下来会通过 <span :class="$style.red_text">sameVNode(oldVnode, vnode)</span> 判断它们是否是相同的 VNode 来决定走不同的更新逻辑：

```js
/**
 * 判读两个节点是否相同
 */
function sameVnode(a, b) {
  return (
    // key 必须相同，需要注意的是 undefined === undefined => true
    a.key === b.key && // 标签相同
    ((a.tag === b.tag &&
      // 都是注释节点
      a.isComment === b.isComment &&
      // 都有 data 属性
      isDef(a.data) === isDef(b.data) &&
      // input 标签的情况
      sameInputType(a, b)) ||
      // 异步占位符节点
      (isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)))
  );
}
```

<span :class="$style.red_text">sameVnode</span> 的逻辑非常简单，如果两个 <span :class="$style.red_text">vnode</span> 的 <span :class="$style.red_text">key</span> 不相等，则是不同的；否
则继续判断对于同步组件，则判断 isComment、data、input 类型等是否相同，对于异步组件，则判断 asyncFactory 是否相同。<br>
所以根据新旧 vnode 是否为 sameVnode，会走到不同的更新逻辑，我们先来说
一下不同的情况。

### 新旧节点不同

1. 创建新节点

```js
// 拿到老节点的真实元素
const oldElm = oldVnode.elm;
// 获取老节点的父元素，即 body
const parentElm = nodeOps.parentNode(oldElm);

// 基于 vnode 创建整棵节点树并插入到 body 元素下
createElm(
  vnode,
  insertedVnodeQueue,
  // extremely rare edge case: do not insert if old element is in a
  // leaving transition. Only happens when combining transition +
  // keep-alive + HOCs. (#4590)
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
);
```

以当前旧节点为参考节点，创建新的节点，并插入到 DOM 中，<span :class="$style.red_text">createElm</span> 的逻
辑之前分析过。

2. 更新父的占位符节点

```js
// 递归更新父占位符节点元素
if (isDef(vnode.parent)) {
  let ancestor = vnode.parent;
  const patchable = isPatchable(vnode);
  while (ancestor) {
    for (let i = 0; i < cbs.destroy.length; ++i) {
      cbs.destroy[i](ancestor);
    }
    ancestor.elm = vnode.elm;
    if (patchable) {
      for (let i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, ancestor);
      }
      // #6513
      // invoke insert hooks that may have been merged by create hooks.
      // e.g. for directives that uses the "inserted" hook.
      const insert = ancestor.data.hook.insert;
      if (insert.merged) {
        // start at index 1 to avoid re-invoking component mounted hook
        for (let i = 1; i < insert.fns.length; i++) {
          insert.fns[i]();
        }
      }
    } else {
      registerRef(ancestor);
    }
    ancestor = ancestor.parent;
  }
}
```

只关注主要逻辑即可，找到当前 <span :class="$style.red_text">vnode</span> 的父的占位符节点，先执行各个
<span :class="$style.red_text">module</span> 的 <span :class="$style.red_text">destroy</span> 的钩子函数，如果当前占位符是一个可挂载的节点，则执行 <span :class="$style.red_text">module</span> 的 <span :class="$style.red_text">create</span> 钩子函数。对于这些钩子函数的作用，在之后的章节会详细介绍。

3. 删除旧节点

```js
// 移除老节点
if (isDef(parentElm)) {
  removeVnodes([oldVnode], 0, 0);
} else if (isDef(oldVnode.tag)) {
  invokeDestroyHook(oldVnode);
}
```

把 <span :class="$style.red_text">oldVnode</span> 从当前 DOM 树中删除，如果父节点存在，则执行 <span :class="$style.red_text">removeVnodes</span>方法：

```js
/**
 * 销毁节点：
 *   执行组件的 destroy 钩子，即执行 $destroy 方法
 *   执行组件各个模块(style、class、directive 等）的 destroy 方法
 *   如果 vnode 还存在子节点，则递归调用 invokeDestroyHook
 */
function invokeDestroyHook(vnode) {
  let i, j;
  const data = vnode.data;
  if (isDef(data)) {
    if (isDef((i = data.hook)) && isDef((i = i.destroy))) i(vnode);
    for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
  }
  if (isDef((i = vnode.children))) {
    for (j = 0; j < vnode.children.length; ++j) {
      invokeDestroyHook(vnode.children[j]);
    }
  }
}

/**
 * 移除指定索引范围（startIdx —— endIdx）内的节点
 */
function removeVnodes(vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    if (isDef(ch)) {
      if (isDef(ch.tag)) {
        removeAndInvokeRemoveHook(ch);
        invokeDestroyHook(ch);
      } else {
        // Text node
        removeNode(ch.elm);
      }
    }
  }
}

function removeAndInvokeRemoveHook(vnode, rm) {
  if (isDef(rm) || isDef(vnode.data)) {
    let i;
    const listeners = cbs.remove.length + 1;
    if (isDef(rm)) {
      // we have a recursively passed down rm callback
      // increase the listeners count
      rm.listeners += listeners;
    } else {
      // directly removing
      rm = createRmCb(vnode.elm, listeners);
    }
    // recursively invoke hooks on child component root node
    if (
      isDef((i = vnode.componentInstance)) &&
      isDef((i = i._vnode)) &&
      isDef(i.data)
    ) {
      removeAndInvokeRemoveHook(i, rm);
    }
    for (i = 0; i < cbs.remove.length; ++i) {
      cbs.remove[i](vnode, rm);
    }
    if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
      i(vnode, rm);
    } else {
      rm();
    }
  } else {
    removeNode(vnode.elm);
  }
}
```

删除节点逻辑很简单，就是遍历待删除的 <span :class="$style.red_text">vnodes</span> 做删除，其中 <span :class="$style.red_text">removeAndInvokeRemoveHook</span> 的作用是从 DOM 中移除节点并执行 module 的 remove 钩子函数，并对它的子节点递归调用 removeAndInvokeRemoveHook 函数；invokeDestroyHook
是执行 module 的 destory 钩子函数以及 vnode 的 destory 钩子函数，并对它的子 vnode 递归调用 invokeDestroyHook 函数；<span :class="$style.red_text">removeNode</span> 就是调用平台的
<span :class="$style.red_text">DOM API</span> 去把真正的 DOM 节点移除。<br>
在之前介绍组件生命周期的时候提到 <span :class="$style.red_text">beforeDestroy & destroyed</span> 这两个生命周期钩子函数，它们就是在执行 <span :class="$style.red_text">invokeDestroyHook</span> 过程中，执行了 vnode 的 <span :class="$style.red_text">destory</span> 钩子函数，它的定义在<span :class="$style.red_text"> src/core/vdom/create-component.js</span> 中：

```js
/**
 * 销毁组件
 *   1、如果组件被 keep-alive 组件包裹，则使组件失活，不销毁组件实例，从而缓存组件的状态
 *   2、如果组件没有被 keep-alive 包裹，则直接调用实例的 $destroy 方法销毁组件
 */
 destroy (vnode: MountedComponentVNode) {
  // 从 vnode 上获取组件实例
  const { componentInstance } = vnode
  if (!componentInstance._isDestroyed) {
    // 如果组件实例没有被销毁
    if (!vnode.data.keepAlive) {
      // 组件没有被 keep-alive 组件包裹，则直接调用 $destroy 方法销毁组件
      componentInstance.$destroy()
    } else {
      // 负责让组件失活，不销毁组件实例，从而缓存组件的状态
      deactivateChildComponent(componentInstance, true /* direct */)
    }
  }
}
```

当组件并不是 <span :class="$style.red_text">keepAlive</span> 的时候，会执行 <span :class="$style.red_text">componentInstance.$destroy()</span> 方法，
然后就会执行 <span :class="$style.red_text">beforeDestroy & destroyed</span> 两个钩子函数。

### 新旧节点相同

对于新旧节点不同的情况，这种创建新节点 -> 更新占位符节点 -> 删除旧节点
的逻辑。还有一种组件 vnode 的更新情况是新旧节点相同，它
会调用 <span :class="$style.red_text">patchVNode</span> 方法，它的定义在 <span :class="$style.red_text">src/core/vdom/patch.js</span> 中：

```js
/**
 * 更新节点
 *   全量的属性更新
 *   如果新老节点都有孩子，则递归执行 diff
 *   如果新节点有孩子，老节点没孩子，则新增新节点的这些孩子节点
 *   如果老节点有孩子，新节点没孩子，则删除老节点的这些孩子
 *   更新文本节点
 */
function patchVnode(
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  // 老节点和新节点相同，直接返回
  if (oldVnode === vnode) {
    return;
  }

  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // clone reused vnode
    vnode = ownerArray[index] = cloneVNode(vnode);
  }

  const elm = (vnode.elm = oldVnode.elm);

  // 异步占位符节点
  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
    } else {
      vnode.isAsyncPlaceholder = true;
    }
    return;
  }

  // 跳过静态节点的更新
  // reuse element for static trees.
  // note we only do this if the vnode is cloned -
  // if the new node is not cloned it means the render functions have been
  // reset by the hot-reload-api and we need to do a proper re-render.
  if (
    isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    // 新旧节点都是静态的而且两个节点的 key 一样，并且新节点被 clone 了 或者 新节点有 v-once指令，则重用这部分节点
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }

  // 执行组件的 prepatch 钩子
  let i;
  const data = vnode.data;
  if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
    i(oldVnode, vnode);
  }

  // 老节点的孩子
  const oldCh = oldVnode.children;
  // 新节点的孩子
  const ch = vnode.children;
  // 全量更新新节点的属性，Vue 3.0 在这里做了很多的优化
  if (isDef(data) && isPatchable(vnode)) {
    // 执行新节点所有的属性更新
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
    if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
  }
  if (isUndef(vnode.text)) {
    // 新节点不是文本节点
    if (isDef(oldCh) && isDef(ch)) {
      // 如果新老节点都有孩子，则递归执行 diff 过程
      if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
    } else if (isDef(ch)) {
      // 老孩子不存在，新孩子存在，则创建这些新孩子节点
      if (process.env.NODE_ENV !== "production") {
        checkDuplicateKeys(ch);
      }
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, "");
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
    } else if (isDef(oldCh)) {
      // 老孩子存在，新孩子不存在，则移除这些老孩子节点
      removeVnodes(oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) {
      // 老节点是文本节点，则将文本内容置空
      nodeOps.setTextContent(elm, "");
    }
  } else if (oldVnode.text !== vnode.text) {
    // 新节点是文本节点，则更新文本节点
    nodeOps.setTextContent(elm, vnode.text);
  }
  if (isDef(data)) {
    if (isDef((i = data.hook)) && isDef((i = i.postpatch))) i(oldVnode, vnode);
  }
}
```

<span :class="$style.red_text">patchVnode</span> 的作用就是把新的 <span :class="$style.red_text">vnode</span> patch 到旧的 <span :class="$style.red_text">vnode</span> 上，这里只关注
关键的核心逻辑，把它拆成四步骤：

### prepatch

```js
let i;
const data = vnode.data;
if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
  i(oldVnode, vnode);
}
```

当更新的 <span :class="$style.red_text">vnode</span> 是一个<span :class="$style.red_text">组件 vnode </span> 的时候，会执行 <span :class="$style.red_text">prepatch</span> 的方法，它的
定义在 <span :class="$style.red_text">src/core/vdom/create-component.js</span> 中：

```js
// 更新 VNode，用新的 VNode 配置更新旧的 VNode 上的各种属性
prepatch(oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
  // 新 VNode 的组件配置项
  const options = vnode.componentOptions
  // 老 VNode 的组件实例
  const child = vnode.componentInstance = oldVnode.componentInstance
  // 用 vnode 上的属性更新 child 上的各种属性
  updateChildComponent(
    child,
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  )
}
```

<span :class="$style.red_text">prepatch</span> 方法就是拿到新的 <span :class="$style.red_text">vnode</span> 的组件配置以及组件实例，去执行 <span :class="$style.red_text">updateC
hildComponent</span> 方法，它的定义在 <span :class="$style.red_text">src/core/instance/lifecycle.js </span>中：

```js
export function updateChildComponent(
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  if (process.env.NODE_ENV !== "production") {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  const newScopedSlots = parentVnode.data.scopedSlots;
  const oldScopedSlots = vm.$scopedSlots;
  const hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  const needsForceUpdate = !!(
    renderChildren || // has new static slots
    vm.$options._renderChildren || // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    const props = vm._props;
    const propKeys = vm.$options._propKeys || [];
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i];
      const propOptions: any = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  const oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== "production") {
    isUpdatingChildComponent = false;
  }
}
```

updateChildComponent 的逻辑也非常简单，由于更新了 vnode，那么 vnode 对
应的实例 vm 的一系列属性也会发生变化，包括占位符 <span :class="$style.red_text">vm.$vnode</span> 的更新、
<span :class="$style.red_text">slot</span> 的更新，<span :class="$style.red_text">listeners</span> 的更新，<span :class="$style.red_text">props</span> 的更新等等。

### 执行 update 钩子函数

```js
if (isDef(data) && isPatchable(vnode)) {
  for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
  if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
}
```

回到 <span :class="$style.red_text">patchVNode</span> 函数，在执行完新的 vnode 的 prepatch 钩子函数，会执行所有 <span :class="$style.red_text">module</span> 的 <span :class="$style.red_text">update</span> 钩子函数以及用户自定义 <span :class="$style.red_text">update</span> 钩子函数，对于 <span :class="$style.red_text">module</span> 的钩子函数。

### 完成 patch 过程

```js
// 老节点的孩子
const oldCh = oldVnode.children;
// 新节点的孩子
const ch = vnode.children;
// 全量更新新节点的属性，Vue 3.0 在这里做了很多的优化
if (isDef(data) && isPatchable(vnode)) {
  // 执行新节点所有的属性更新
  for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
  if (isDef((i = data.hook)) && isDef((i = i.update))) i(oldVnode, vnode);
}
if (isUndef(vnode.text)) {
  // 新节点不是文本节点
  if (isDef(oldCh) && isDef(ch)) {
    // 如果新老节点都有孩子，则递归执行 diff 过程
    if (oldCh !== ch)
      updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
  } else if (isDef(ch)) {
    // 老孩子不存在，新孩子存在，则创建这些新孩子节点
    if (process.env.NODE_ENV !== "production") {
      checkDuplicateKeys(ch);
    }
    if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, "");
    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
  } else if (isDef(oldCh)) {
    // 老孩子存在，新孩子不存在，则移除这些老孩子节点
    removeVnodes(oldCh, 0, oldCh.length - 1);
  } else if (isDef(oldVnode.text)) {
    // 老节点是文本节点，则将文本内容置空
    nodeOps.setTextContent(elm, "");
  }
} else if (oldVnode.text !== vnode.text) {
  // 新节点是文本节点，则更新文本节点
  nodeOps.setTextContent(elm, vnode.text);
}
```

如果 <span :class="$style.red_text">vnode</span> 是个文本节点且新旧文本不相同，则直接替换文本内容。如果不是
文本节点，则判断它们的子节点，并分了几种情况处理：<br>

1. <span :class="$style.red_text">oldCh</span> 与 <span :class="$style.red_text">ch</span> 都存在且不相同时，使用 updateChildren 函数来更新子节点，这个
   后面重点讲。

2. 如果只有 <span :class="$style.red_text">ch</span> 存在，表示旧节点不需要了。如果旧的节点是文本节点则先将
   节点的文本清除，然后通过 addVnodes 将 ch 批量插入到新节点 elm 下。

3. 如果只有 <span :class="$style.red_text">oldCh</span> 存在，表示更新的是空节点，则需要将旧的节点通过 remov
   eVnodes 全部清除。

4. 当只有旧节点是文本节点的时候，则清除其节点文本内容。

### 执行 postpatch 钩子函数

```js
if (isDef(data)) {
  if (isDef((i = data.hook)) && isDef((i = i.postpatch))) i(oldVnode, vnode);
}
```

再执行完 <span :class="$style.red_text">patch</span> 过程后，会执行 <span :class="$style.red_text">postpatch</span> 钩子函数，它是组件自定义的钩子函数，有则执行。

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
