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

#### 代码讲解

1. 快排首先找一个哨兵位，插入一个哨兵位置或者就是拿第一位位哨兵，所以比如一个数组 arr = [1,2,3,4,5] ，往队头塞一个数进去，让首位是个哨兵，然后后面的 (1, arr.length - 1) 才是真正的数据。

2. 分为两个函数，一个是判断是否需要快排与基准位置，需要快排就执行左边与右边的划分递归函数，另一个是快排函数。

```js
const quickSort = (arr, start, end) => {
  // 设置哨兵
  arr[0] = arr[start];
  while (start < end) {
    while (start < end && arr[end] >= arr[0]) {
      end--;
    }
    // 如果小于哨兵，则赋值给start
    arr[start] = arr[end];

    while (start < end && arr[start] <= arr[0]) {
      start++;
    }
    // 如果大于哨兵，则赋值给end
    arr[end] = arr[start];
  }
  arr[start] = arr[0];

  // 返回当前哨兵的位置
  return start;
};

const sorted = (arr, strat, end) => {
  if (start < end) {
    const now = quickSort(arr, start, end);
    sorted(arr, start, now - 1);
    sorted(arr, now + 1, end);
  }
};
```

<div style="color: #409EFF; fontSize: 18px; padding: 20px 0">
  以上快排方法已经写完，用了哨兵作为基准，分治思想，将需要处理的数据不断分解，再加上递归思想，达到了想要的快速排序的效果
</div>

```js
const arr = [1, 2, 3, 4];
// 这里主要是设置哨兵
arr.unshift(-1);
sorted(arr, 1, arr.length - 1);
```

#### 复杂度

时间复杂度：O(nlogn) <br/>
空间复杂度：O(n)

### 解决方式 3

这里的解决方式都是从难到易的，也是最常用的 冒泡
