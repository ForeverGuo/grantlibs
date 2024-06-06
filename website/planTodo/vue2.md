## Vue2 源码分析

<script setup>
import { ref, reactive } from 'vue'

const list = reactive([
  {
    name: '准备工作',
    done: true,
  },
  {
    name: '数据驱动',
    done: true,
  },
  {
    name: '组件化',
    done: true,
  },
  {
    name: '深入响应式原理（上）',
    done: true,
  },
  {
    name: '深入响应式原理（下）',
    done: true,
  },
  {
    name: '编译（上）',
    done: true,
  },
  {
    name: '编译（下）',
    done: false,
  },
  {
    name: '扩展（上）',
    done: false,
  },
  {
    name: '扩展（中）',
    done: false,
  },
  {
    name: '扩展（下）',
    done: false,
  },
  {
    name: 'VueRouter',
    done: false,
  },
  {
    name: 'Vuex',
    done: false,
  },
])

const handleItem = (idx) => {
  list[idx].done = !list[idx].done
}

</script>

<div 
  :class="$style.flex" 
  v-for="(item, index) in list" :key="index"
  @click="handleItem(index)"
>
  <span :class="[$style.common,item.done ? $style.actived : $style.noActive ]">{{ item.done ? '✓' : '✗' }}</span>
  <span >{{ item.name }}</span>
</div>

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
  cursor: pointer;
  margin-bottom: 15px;
}
</style>
