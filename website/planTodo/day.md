<div :class="$style.special_text">
  每日学习日志
</div>

## 2024-05-10

- <div :class="$style.flex"><span :class="[$style.common,$style.actived]">✓</span>规划总体学习目标。</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.actived]">✓</span>完成todo List 界面样式更新。</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.actived]">✓</span>完成响应式原理之响应式对象 30%。</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.actived]">✓</span>了解uniapp / uniapp X 的 uts 20%。</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.actived]">✓</span>完成HbuilderX 4.15版本升级。</div>

<style module>
.special_text {
  color: #FFC107; 
  font-size: 30px;  
  padding: 20px 0;
}
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
