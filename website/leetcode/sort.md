# Sort 问题

### 问题描述

 <div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  其实就是 数组的排序问题，但可以有不同的解法。<br/>
  由于上一题topk的解决方案其主要还是排序算法的不同应用，说明基础算法还是要熟练掌握，解决问题才能事半功倍。
  </div>

### 解决方式 1

  <div style="color: #409EFF; fontSize: 18px; padding: 20px 0">
  这里主要想针对高效且不被常想到的排序方法实现，堆排序空间复杂度为O(n), 堆排序的最坏、最好、平均时间复杂度均为O(nlogn)，是不稳定排序算法。
  </div>

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
const sortArray = (nums) => {
  const len = nums.length;
  // 数组开始排序 最大堆
  for (let s = Math.floor(len / 2) - 1; s >= 0; s--) {
    maxHeap(nums, s, len);
  }

  // 从小到大排序 置换最大值和最后一个值
  for (let m = len - 1; m >= 0; m--) {
    swap(nums, 0, m);
    maxHeap(nums, 0, m);
  }

  return nums;
};
const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);
// 堆排序 + 递归
const maxHeap = (arr, i, n) => {
  let index = i,
    left = 2 * index + 1,
    right = 2 * index + 2;

  if (left < n && arr[left] > arr[index]) {
    index = left;
  }

  if (right < n && arr[right] > arr[index]) {
    index = right;
  }

  if (index !== i) {
    swap(arr, index, i);
    maxHeap(arr, index, n);
  }
};
```

#### 复杂度

时间复杂度：O(nlogn) <br/>
空间复杂度：O(k)

### 解决方式 2

快排也很经典 更新中...
