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

## 组件更新

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
