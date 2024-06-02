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

##

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
