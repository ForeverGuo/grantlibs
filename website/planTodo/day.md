<div :class="$style.special_text">
  每日学习日志
</div>

## 2024-05-10

- <div :class="$style.flex"><span :class="[$style.common,$style.actived]">✓</span>设定总体学习目标</div>
- <div :class="$style.flex"><span :class="[$style.common,$style.actived]">✓</span>完成todo List 界面更新</div>

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
