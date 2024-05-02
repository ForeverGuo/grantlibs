## 认识 Flow

<span :class="$style.common_text">
  Flow
</span>是 facebook 出品的 JavaScript 静态类型检查工具。Vue.js 的源码利用
了 Flow 做了静态类型检查，所以了解 Flow 有助于我们阅读源码。

### 为什么要用 Flow

  <br/>
  <span :class="$style.common_text">
    JavaScript
  </span>是动态类型语言，它的灵活性有目共睹，但是过于灵活的副作用是
  很容易就写出非常隐蔽的隐患代码，在编译期甚至看上去都不会报错，但在运行阶段就可能出现各种奇怪的bug。<br/><br/>
    类型检查是当前动态类型语言的发展趋势，所谓类型检查，就是在编译期尽早
  发现（由类型错误引起的）bug，又不影响代码运行（不需要运行时动态检查
  类型），使编写 JavaScript 具有和编写 Java 等强类型语言相近的体验。<br/><br/>
    项目越复杂就越需要通过工具的手段来保证项目的维护性和增强代码的可读性。
  Vue.js 在做 2.0 重构的时候，在 ES2015 的基础上，除了 ESLint 保证代码
  风格之外，也引入了 Flow 做静态类型检查。之所以选择 Flow，主要是因为
  Babel 和 ESLint 都有对应的 Flow 插件以支持语法，可以完全沿用现有的构建
  配置，非常小成本的改动就可以拥有静态类型检查的能力。

### flow 文件夹定义

```js
flow
├── compiler         # 编译相关
├── component        # 组件相关
├── global-api       # Global API 结构
├── modules          # 第三方定义
├── options          # 选项相关
├── ssr              # 服务端渲染相关
├── vnode            # 虚拟 node 相关
```

## 源码目录设计

### vue 源码核心目录都在 src 下

```js
src
├── compiler           # 编译相关
├── core               # 核心代码
├── platforms          # 不同平台的支持
├── server             # 服务端渲染
├── sfc                # .vue 文件解析
├── shared             # 共享代码
```

### compiler

<br/>
<span :class="$style.common_text">
 compiler </span>目录包含 Vue.js 所有编译相关的代码。它包括把模板解析成 ast 语法树，ast 语法树优化，代码生成等功能。<br/><br/>
 编译的工作可以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，
 所以更推荐前者——离线编译。

### core

<br/>
<span :class="$style.common_text">
 core </span> 目录包含了 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等等。<br/><br/>
这里的代码可谓是 Vue.js 的灵魂，也是我们之后需要重点分析的地方。

### platform

<br/>
<span :class="$style.common_text">
 Vue.js  </span>是一个跨平台的 MVVM 框架，它可以跑在 web 上，也可以配合 weex跑在 natvie 客户端上。platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。

### server

<br/>
<span :class="$style.common_text">
 Vue.js 2.x</span>支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。
注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混
为一谈。<br><br>
服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接
发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

### sfc

<br/>
通常我们开发<span :class="$style.common_text">
 Vue.js</span>都会借助 webpack/vite 构建， 然后通vue 单文件的编写组件。<br><br>
这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。

### shared

<br/>
<span :class="$style.common_text">Vue.js</span>会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 Vue.js和服务端的 Vue.js 所共享的。

## 源码构建

<br>
Vue.js 源码是基于<span :class="$style.common_text">Rollup</span> 构建的，它的构建相关配置都在 scripts 目录下。

### 构建脚本

<br>
通常一个基于 NPM 托管的项目都会有一个 package.json 文件，它是对项目
的描述文件，它的内容实际上是一个标准的 JSON 对象。<br><br>
我们通常会配置 script 字段作为 NPM 的执行脚本，Vue.js 源码构建的脚本
如下：

```json
{
  "scripts": {
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build -- weex"
  }
}
```

这里总共有 3 条命令，作用都是构建 Vue.js，后面 2 条是在第一条命令的基
础上，添加一些环境参数。

### 构建过程

<br>
我们对于构建过程分析是基于源码的，先打开构建的入口 JS 文件，
在<span :class="$style.special_text">scripts/build.js</span> 中：

```js
let builds = require("./config").getAllBuilds();

// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(",");
  builds = builds.filter((b) => {
    return filters.some(
      (f) => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1
    );
  });
} else {
  // filter out weex builds by default
  builds = builds.filter((b) => {
    return b.output.file.indexOf("weex") === -1;
  });
}

build(builds);
```

这段代码逻辑非常简单，先从配置文件读取配置，再通过命令行参数对构建配
置做过滤，这样就可以构建出不同用途的 Vue.js 了。接下来我们看一下配置文
件，在 <span :class="$style.special_text">scripts/config.js </span>中：

```js
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  "web-runtime-cjs-dev": {
    entry: resolve("web/entry-runtime.js"),
    dest: resolve("dist/vue.runtime.common.dev.js"),
    format: "cjs",
    env: "development",
    banner,
  },
  "web-runtime-cjs-prod": {
    entry: resolve("web/entry-runtime.js"),
    dest: resolve("dist/vue.runtime.common.prod.js"),
    format: "cjs",
    env: "production",
    banner,
  },
  // Runtime+compiler CommonJS build (CommonJS)
  "web-full-cjs-dev": {
    entry: resolve("web/entry-runtime-with-compiler.js"),
    dest: resolve("dist/vue.common.dev.js"),
    format: "cjs",
    env: "development",
    alias: { he: "./entity-decoder" },
    banner,
  },
  "web-full-cjs-prod": {
    entry: resolve("web/entry-runtime-with-compiler.js"),
    dest: resolve("dist/vue.common.prod.js"),
    format: "cjs",
    env: "production",
    alias: { he: "./entity-decoder" },
    banner,
  },
  // Runtime only ES modules build (for bundlers)
  "web-runtime-esm": {
    entry: resolve("web/entry-runtime.js"),
    dest: resolve("dist/vue.runtime.esm.js"),
    format: "es",
    banner,
  },
  // Runtime+compiler ES modules build (for bundlers)
  "web-full-esm": {
    entry: resolve("web/entry-runtime-with-compiler.js"),
    dest: resolve("dist/vue.esm.js"),
    format: "es",
    alias: { he: "./entity-decoder" },
    banner,
  },
  // Runtime+compiler ES modules build (for direct import in browser)
  "web-full-esm-browser-dev": {
    entry: resolve("web/entry-runtime-with-compiler.js"),
    dest: resolve("dist/vue.esm.browser.js"),
    format: "es",
    transpile: false,
    env: "development",
    alias: { he: "./entity-decoder" },
    banner,
  },
  // Runtime+compiler ES modules build (for direct import in browser)
  "web-full-esm-browser-prod": {
    entry: resolve("web/entry-runtime-with-compiler.js"),
    dest: resolve("dist/vue.esm.browser.min.js"),
    format: "es",
    transpile: false,
    env: "production",
    alias: { he: "./entity-decoder" },
    banner,
  },
  // runtime-only build (Browser)
  "web-runtime-dev": {
    entry: resolve("web/entry-runtime.js"),
    dest: resolve("dist/vue.runtime.js"),
    format: "umd",
    env: "development",
    banner,
  },
  // runtime-only production build (Browser)
  "web-runtime-prod": {
    entry: resolve("web/entry-runtime.js"),
    dest: resolve("dist/vue.runtime.min.js"),
    format: "umd",
    env: "production",
    banner,
  },
  // Runtime+compiler development build (Browser)
  "web-full-dev": {
    entry: resolve("web/entry-runtime-with-compiler.js"),
    dest: resolve("dist/vue.js"),
    format: "umd",
    env: "development",
    alias: { he: "./entity-decoder" },
    banner,
  },
  // Runtime+compiler production build  (Browser)
  "web-full-prod": {
    entry: resolve("web/entry-runtime-with-compiler.js"),
    dest: resolve("dist/vue.min.js"),
    format: "umd",
    env: "production",
    alias: { he: "./entity-decoder" },
    banner,
  },
  // Web compiler (CommonJS).
  "web-compiler": {
    entry: resolve("web/entry-compiler.js"),
    dest: resolve("packages/vue-template-compiler/build.js"),
    format: "cjs",
    external: Object.keys(
      require("../packages/vue-template-compiler/package.json").dependencies
    ),
  },
  // Web compiler (UMD for in-browser use).
  "web-compiler-browser": {
    entry: resolve("web/entry-compiler.js"),
    dest: resolve("packages/vue-template-compiler/browser.js"),
    format: "umd",
    env: "development",
    moduleName: "VueTemplateCompiler",
    plugins: [node(), cjs()],
  },
  ...
};
```

对于单个配置，它是遵循 Rollup 的构建规则的。其中 entry 属性表示构建的
入口 JS 文件地址，dest 属性表示构建后的 JS 文件地址。<br><br>
format 属性表示构建的格式，cjs 表示构建出来的文件遵循<span :class="$style.special_text"> CommonJS </span>规范，es 表示构建出来
的文件遵循<span :class="$style.special_text"> ES Module</span> 规范。 umd 表示构建出来的文件遵循<span :class="$style.special_text"> UMD</span> 规范。<br><br>

以 web-runtime-cjs 配置为例，它的 entry 是
<span :class="$style.red_text">resolve('web/entry-runtime.js')</span>，先来看一下 resolve 函数的定义。
源码目录：scripts/config.js

```js
const aliases = require("./alias");
const resolve = (p) => {
  const base = p.split("/")[0];
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1));
  } else {
    return path.resolve(__dirname, "../", p);
  }
};
```

这里的 <span :class="$style.red_text">resolve</span> 函数实现非常简单，它先把 <span :class="$style.red_text">resolve</span> 函数传入的参数 p 通过 <span :class="$style.red_text">/</span> 做了分割成数组，然后取数组第一个元素设置为<span :class="$style.red_text">base</span>。在我们这个例子中，
参数 <span :class="$style.red_text">p</span> 是 <span :class="$style.red_text">web/entry-runtime.js</span>，那么 <span :class="$style.red_text">base</span> 则为 <span :class="$style.red_text">web</span>。<span :class="$style.red_text">base</span> 并不是实际的
路径，它的真实路径借助了别名的配置，我们来看一下别名配置的代码，在<span :class="$style.red_text"> scripts/alias </span> 中：

```js
const path = require("path");

const resolve = (p) => path.resolve(__dirname, "../", p);

module.exports = {
  vue: resolve("src/platforms/web/entry-runtime-with-compiler"),
  compiler: resolve("src/compiler"),
  core: resolve("src/core"),
  shared: resolve("src/shared"),
  web: resolve("src/platforms/web"),
  weex: resolve("src/platforms/weex"),
  server: resolve("src/server"),
  sfc: resolve("src/sfc"),
};
```

很显然，这里 <span :class="$style.red_text">web</span> 对应的真实的路径是 <span :class="$style.red_text">path.resolve(\_\_dirname,
'../src/platforms/web')</span>，这个路径就找到了 Vue.js 源码的 web 目录。然
后 <span :class="$style.red_text">resolve</span> 函数通过<span :class="$style.red_text"> path.resolve(aliases[base], p.slice(base.length + 1))</span>
找到了最终路径，它就是 Vue.js 源码 web 目录下的 <span :class="$style.red_text">entry-runtime.js</span>。因此，
<span :class="$style.red_text">web-runtime-cjs</span> 配置对应的入口文件就找到了。
它经过 Rollup 的构建打包后，最终会在 dist 目录下生
成 <span :class="$style.red_text">vue.runtime.common.js</span>。

### Runtime Only

<br>
我们在使用 Runtime Only 版本的 Vue.js 的时候，通常需要借助如 webpack
的 vue-loader 工具把 .vue 文件编译成 JavaScript，因为是在编译阶段做的，
所以它只包含运行时的 Vue.js 代码，因此代码体积也会更轻量。

### Runtime + Compiler

<br>
我们如果没有对代码做预编译，但又使用了 Vue 的 template 属性并传入一个
字符串，则需要在客户端编译模板，如下所示：

```js
// 需要编译器的版本
new Vue({
  template: "<div>{{ hi }}</div>",
});

// 这种情况不需要
new Vue({
  render(h) {
    return h("div", this.hi);
  },
});
```

> [!TIP]
> 通过这一节的分析，我们可以了解到 Vue.js 的构建打包过程，也知道了不同作
> 用和功能的 Vue.js 它们对应的入口以及最终编译生成的 JS 文件。尽管在实际
> 开发过程中我们会用 Runtime Only 版本开发比较多，但为了分析 Vue 的编译
> 过程，重点分析的源码是 Runtime+Compiler 的 Vue.js。

## 从入口开始

<span :class="$style.special_text">vue 引入文件: </span>

```js
1. "src/platforms/web/entry-runtime-with-compiler.js"
2. "./runtime/index"
3. "core/index"
4. "./instance/index"
```

我们之前提到过 Vue.js 构建过程，在 web 应用下，我们来分析 Runtime +
Compiler 构建出来的 Vue.js，它的入口是<span :class="$style.red_text"> src/platforms/web/entry-runtime-with-compiler.js：</span>

```js
/* @flow */

import config from "core/config";
import { warn, cached } from "core/util/index";
import { mark, measure } from "core/util/perf";

import Vue from "./runtime/index";
import { query } from "./util/index";
import { compileToFunctions } from "./compiler/index";
import {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref,
} from "./util/compat";

const idToTemplate = cached((id) => {
  const el = query(id);
  return el && el.innerHTML;
});

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

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    const container = document.createElement("div");
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

Vue.compile = compileToFunctions;

export default Vue;
```

当我们的代码执行 import Vue from 'vue' 的时候，就是从这个入口执行
代码来初始化 Vue.

### Vue 的入口

上面代码中有引入<span :class="$style.common_text"> import Vue from "./runtime/index"</span>

```js
/* @flow */

import Vue from "core/index";
import config from "core/config";
import { extend, noop } from "shared/util";
import { mountComponent } from "core/instance/lifecycle";
import { devtools, inBrowser } from "core/util/index";

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement,
} from "web/util/index";

import { patch } from "./patch";
import platformDirectives from "./directives/index";
import platformComponents from "./components/index";

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// 在 Vue 原型链上安装 web 平台的 patch 函数
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined;
  // 这里执行beforeMount mounted
  return mountComponent(this, el, hydrating);
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit("init", Vue);
      } else if (
        process.env.NODE_ENV !== "production" &&
        process.env.NODE_ENV !== "test"
      ) {
        console[console.info ? "info" : "log"](
          "Download the Vue Devtools extension for a better development experience:\n" +
            "https://github.com/vuejs/vue-devtools"
        );
      }
    }
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NODE_ENV !== "test" &&
      config.productionTip !== false &&
      typeof console !== "undefined"
    ) {
      console[console.info ? "info" : "log"](
        `You are running Vue in development mode.\n` +
          `Make sure to turn on production mode when deploying for production.\n` +
          `See more tips at https://vuejs.org/guide/deployment.html`
      );
    }
  }, 0);
}

export default Vue;
```

这里关键的代码<span :class="$style.common_text">import Vue from "core/index"</span>

```js
import Vue from "./instance/index";
import { initGlobalAPI } from "./global-api/index";
import { isServerRendering } from "core/util/env";
import { FunctionalRenderContext } from "core/vdom/create-functional-component";

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, "$isServer", {
  get: isServerRendering,
});

Object.defineProperty(Vue.prototype, "$ssrContext", {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  },
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, "FunctionalRenderContext", {
  value: FunctionalRenderContext,
});

Vue.version = "__VERSION__";

export default Vue;
```

这里有关键的两部分代码 <br>
第一部分是<span :class="$style.common_text"> import Vue from "./instance/index"</span><br>
第二部分是<span :class="$style.common_text">initGlobalAPI(Vue)</span><br>
Vue 的定义

```js
import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

// Vue 的构造函数
function Vue(options) {
  // 调用 Vue.prototype._init 方法，该方法是在 initMixin 中定义的
  this._init(options);
}

// 定义 Vue.prototype._init 方法
initMixin(Vue);
/**
 * 定义：
 *   Vue.prototype.$data
 *   Vue.prototype.$props
 *   Vue.prototype.$set
 *   Vue.prototype.$delete
 *   Vue.prototype.$watch
 */
stateMixin(Vue);
/**
 * 定义 事件相关的 方法：
 *   Vue.prototype.$on
 *   Vue.prototype.$once
 *   Vue.prototype.$off
 *   Vue.prototype.$emit
 */
eventsMixin(Vue);
/**
 * 定义：
 *   Vue.prototype._update
 *   Vue.prototype.$forceUpdate
 *   Vue.prototype.$destroy
 */
lifecycleMixin(Vue);
/**
 * 执行 installRenderHelpers，在 Vue.prototype 对象上安装运行时便利程序
 *
 * 定义：
 *   Vue.prototype.$nextTick
 *   Vue.prototype._render
 */
renderMixin(Vue);

export default Vue;
```

在这里，我们终于看到了 Vue 的庐山真面目，它实际上就是一个用 Function
实现的类，我们只能通过<span :class="$style.common_text"> new Vue </span> 去实例化它。<br>
这里说明为何 Vue 不用 ES6 的 Class 去实现呢？<br>
我们往后看这里有很多 xxxMixin 的函数调用，并把 Vue 当参数传入，它们的功能都是给 Vue 的 prototype 上扩展一些方法，Vue 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里实现所有，这种方式是用 Class 难以实现的。这么做的好处是非常方便代码的维护和管理，这种编程技巧也非常值得学习。<br><br>

<span :class="$style.special_text">initGlobalAPI</span>

Vue.js 在整个初始化过程中，除了给它的原型 prototype 上扩展方法，还会
给 Vue 这个对象本身扩展全局的静态方法，它的定义在 src/core/global-
api/index.js 中：

```js
/**
 * 初始化 Vue 的众多全局 API，比如：
 *   默认配置：Vue.config
 *   工具方法：Vue.util.xx
 *   Vue.set、Vue.delete、Vue.nextTick、Vue.observable
 *   Vue.options.components、Vue.options.directives、Vue.options.filters、Vue.options._base
 *   Vue.use、Vue.extend、Vue.mixin、Vue.component、Vue.directive、Vue.filter
 *
 */
export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  // Vue 的众多默认配置项
  configDef.get = () => config;

  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      );
    };
  }

  // Vue.config
  Object.defineProperty(Vue, "config", configDef);

  /**
   * 暴露一些工具方法，轻易不要使用这些工具方法，处理你很清楚这些工具方法，以及知道使用的风险
   */
  Vue.util = {
    // 警告日志
    warn,
    // 类似选项合并
    extend,
    // 合并选项
    mergeOptions,
    // 设置响应式
    defineReactive,
  };

  // Vue.set / delete / nextTick
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 响应式方法
  Vue.observable = <T>(obj: T): T => {
    observe(obj);
    return obj;
  };

  // Vue.options.compoents/directives/filter
  Vue.options = Object.create(null);
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });

  // 将 Vue 构造函数挂载到 Vue.options._base 上
  Vue.options._base = Vue;

  // 在 Vue.options.components 中添加内置组件，比如 keep-alive
  extend(Vue.options.components, builtInComponents);

  // Vue.use
  initUse(Vue);
  // Vue.mixin
  initMixin(Vue);
  // Vue.extend
  initExtend(Vue);
  // Vue.component/directive/filter
  initAssetRegisters(Vue);
}
```

> [!TIP]
> Vue 的初始化过程基本介绍完毕。这一节的目的是对 Vue
> 是什么有一个直观的认识，它本质上就是一个用 Function 实现的 Class，然
> 后它的原型 prototype 以及它本身都扩展了一系列的方法和属性。

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
