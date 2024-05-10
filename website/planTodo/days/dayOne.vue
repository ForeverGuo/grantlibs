<script setup>
import { ref, reactive } from "vue";

const list1 = reactive();
</script>
<template>
  <div :class="$style.flex" v-for="(item, index) in list1" :key="index">
    <span :class="[$style.common, $style.actived]">✓</span>
    {{ item.name }}
  </div>
</template>
