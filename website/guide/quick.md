# 代码引入

```html
<script setup>
  import { clone } from "grantlibs";
  const deepObj = clone.deep({ a: 1, b: 2 });
  const shallowObj = clone.shallow({ a: 1, b: 2 });
</script>
```
