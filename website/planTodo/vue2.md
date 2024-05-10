## Vue2 源码分析

- <div :class="$style.flex"><span :class="[$style.common,$style.actived]">✓</span> 准备工作</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.actived]">✓</span> 数据驱动</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span> 组件化</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span> 深入响应式原理（上）</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span> 深入响应式原理（下） </div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span> 编译（上）</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span> 编译（下）</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span> 扩展（上）</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span> 扩展（中）</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span> 扩展（下）</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span>VueRouter</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.noActive]">✗</span>Vuex</div>

<style module>
.noActive {
  background: #efe3e3;
  color: #E91E63;
}

.actived {
  background: #4CAF50;
}

.common {
  display: inline-flex;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 10px;
  align-items: center;
  padding: 6px;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.flex {
  display: flex;
  align-items: center;
}
</style>
