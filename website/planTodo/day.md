<script setup>
import listOne from './days/20140510.ts'
</script>

<div :class="$style.special_text">
  每日学习日志
</div>

## 2024-05-10

<div
  :class="$style.flex"
  v-for="(item, index) in listOne"
  :key="index">
  <span :class="[$style.common,$style.actived]">✓</span>
  {{ item.name }}
</div>

<style module>
.special_text {
  color: #FFC107; 
  font-size: 40px;  
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
  margin-bottom: 15px;
}
</style>
