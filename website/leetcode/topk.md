# Top K 问题

### 问题描述

  <div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  所谓 Top k 问题？简单来说就是在一组数据里面找到频率出现最高的前 k 个数，或前 k 大（当然也可以是前 k 小）的数。
  </div>

### 解决方式 1

  <div style="color: #409EFF; fontSize: 18px; padding: 20px 0">
  首先可以想到，用最简单的方式就是 sort 函数排序，返回前 k 个数。
  </div>

```ts
function inventoryManagement(stock: number[], cnt: number): number[] {
  return stock.sort((a, b) => a - b).slice(0, cnt);
}
```

### 解决方式 2
