# 快速开始
本节将介绍如何在项目中使用 grantguo-libs.js
## 用法
```html
<script setup>
  import { clone } from 'grantguo-libs'
    /* 深度拷贝 */
  const deepObj = clone.deep(obj)
  /* 深度拷贝 */
  const shallowObj = clone.shallow(obj)
</script>
```
