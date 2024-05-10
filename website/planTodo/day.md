<script setup>
import list10 from './days/20140510.ts'
import list11 from './days/20140511.ts'
</script>

<div :class="$style.special_text">
  每日清单
</div>

## 2024-05-10

<div
  :class="$style.flex"
  v-for="(item, index) in list10"
  :key="index">
  <span :class="[$style.common,item.done ? $style.actived : $style.noActive ]">{{ item.done ? '✓' : '✗' }}</span>
  <span >{{ item.name }}</span>
</div>

## 2024-05-11

<div
  :class="$style.flex"
  v-for="(item, index) in list11"
  :key="index">
  <span :class="[$style.common,item.done ? $style.actived : $style.noActive ]">{{ item.done ? '✓' : '✗' }}</span>
  <span :class="item.status == 'will' ? $style.will : $style.achive">{{ item.status == 'will' ? '计划-' : '实际完成-' }}</span>
  <span >{{ item.name }}</span>
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

.will {
  font-size: 25px;
  color: #E91E63;
}

.achive {
  font-size: 25px;
  color: #4CAF50;
}
</style>
