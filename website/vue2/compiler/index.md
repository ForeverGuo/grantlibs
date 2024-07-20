## 编译入口

## 为什么要这么设计编译入口

:::info

<span :class="$style.red_text">Vue.js</span> 在不同的平台下都会有编译的过程，因此编译过程中的依赖的配置<span :class="$style.red_text">baseOptions</span>会有所不同 <br>

<span :class="$style.red_text">Vue.js</span> 利用了函数柯里化的技巧很好的实现了 <span :class="$style.red_text">baseOptions</span> 的参数保留。同样，Vuejs 也是利用函数柯里化技巧把 <span :class="$style.red_text">baseCompile</span> 函数抽出来，把真正编译的过程和其他逻辑如对编译配置处理，缓存处理等剥离开

:::

## parse 的整体流程

主要是把 html 代码 转换成 ast 树

1. 遍历 html 字符串进行解析

```js
 * 通过循环遍历 html 模版字符串，依次处理其中的各个标签，以及标签上的属性
 * @param {*} html html 模版
 * @param {*} options 配置项
 */
export function parseHTML(html, options) {
  // 这里代码较长，仅提供部分代码
  // 确保不是在 script、style、textarea 这样的纯文本元素中
  if (!lastTag || !isPlainTextElement(lastTag)) {
    // textEnd === 0 说明在开头找到了
      // 分别处理可能找到的注释标签、条件注释标签、Doctype、开始标签、结束标签
      // 每处理完一种情况，就会截断（continue）循环，并且重置 html 字符串，将处理过的标签截掉，下一次循环处理剩余的 html 字符串模版
      if (textEnd === 0) { }

      if (textEnd >= 0) {
        // 能走到这儿，说明虽然在 html 中匹配到到了 <xx，但是这不属于上述几种情况，
        // 它就只是一个普通的一段文本：<我是文本
        // 于是从 html 中找到下一个 <，直到 <xx 是上述几种情况的标签，则结束，
        // 在这整个过程中一直在调整 textEnd 的值，作为 html 中下一个有效标签的开始位置
      }

      // 如果 textEnd < 0，说明 html 中就没找到 <，那说明 html 就是一段文本
      if (textEnd < 0) {
        text = html
      }

      // 将文本内容从 html 模版字符串上截取掉
      if (text) {
        advance(text.length)
      }

  } else {
  // 处理 script、style、textarea 标签的闭合标签
  }

}
```

## optimize

1. 遍历 AST，标记每个节点是静态节点还是动态节点，然后标记静态根节点
2. 这样在后续更新的过程中就不需要再关注这些节点

```js
export function optimize(root: ?ASTElement, options: CompilerOptions) {
  if (!root) return;
  /**
   * options.staticKeys = 'staticClass,staticStyle'
   * isStaticKey = function(val) { return map[val] }
   */
  isStaticKey = genStaticKeysCached(options.staticKeys || "");
  // 平台保留标签
  isPlatformReservedTag = options.isReservedTag || no;
  // 遍历所有节点，给每个节点设置 static 属性，标识其是否为静态节点
  markStatic(root);
  // 进一步标记静态根，一个节点要成为静态根节点，需要具体以下条件：
  // 节点本身是静态节点，而且有子节点，而且子节点不只是一个文本节点，则标记为静态根
  // 静态根节点不能只有静态文本的子节点，因为这样收益太低，这种情况下始终更新它就好了
  markStaticRoots(root, false);
}
```

<span :class="$style.red_text">markStatic</span> 静态标记节点

```js
/**
 * 在所有节点上设置 static 属性，用来标识是否为静态节点
 * 注意：如果有子节点为动态节点，则父节点也被认为是动态节点
 * @param {*} node
 * @returns
 */
function markStatic(node: ASTNode) {
  // 通过 node.static 来标识节点是否为 静态节点
  node.static = isStatic(node);
  if (node.type === 1) {
    /**
     * 不要将组件的插槽内容设置为静态节点，这样可以避免：
     *   1、组件不能改变插槽节点
     *   2、静态插槽内容在热重载时失败
     */
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== "slot" &&
      node.attrsMap["inline-template"] == null
    ) {
      // 递归终止条件，如果节点不是平台保留标签  && 也不是 slot 标签 && 也不是内联模版，则直接结束
      return;
    }
    // 遍历子节点，递归调用 markStatic 来标记这些子节点的 static 属性
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i];
      markStatic(child);
      // 如果子节点是非静态节点，则将父节点更新为非静态节点
      if (!child.static) {
        node.static = false;
      }
    }
    // 如果节点存在 v-if、v-else-if、v-else 这些指令，则依次标记 block 中节点的 static 属性
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block;
        markStatic(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}
```

::: info

1. optimize 的目标就是通过标记静态根的方式，优化重新渲染过程中对静态节点的处理逻辑；
2. optimize 的过程就是深度遍历这个 AST 树，先标记静态节点，再标记静态根；
   :::

## codegen

- codegen 的作用

主要是将 AST 转化为代码的字符串形式即可执行的代码

- codegen 的整体流程

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
