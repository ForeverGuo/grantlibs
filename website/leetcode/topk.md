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
function inventoryManagement(stock: number[], k: number): number[] {
  return stock.sort((a, b) => a - b).slice(0, k);
}
```

#### 复杂度

时间复杂度：O(nlogn) <br/>
空间复杂度：O(logn)

### 解决方式 2

堆是一种非常常用的的数据结构。最大堆的性质：节点值大于子节点的值，堆顶元素是最大元素，利用这个性质，整体的算法流程如下：

- 创建大小为 k 的最大堆
- 将数组的前 k 个元素放入堆中
- 从下标的 k 继续开始依次遍历数组的剩余元素：
  - 如果元素小于堆顶元素，那么取出堆顶元素，将当前元素入堆
  - 如果元素大于/等于堆顶元素，不做操作

由于堆的大小是 k，空间复杂度是 O(k),时间复杂度是 O(nlogk)

```js
const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

class MaxHeap {
  constructor(arr = []) {
    this.container = [];
    if (Array.isArray(arr)) {
      // 筛选最大值
      arr.forEach(this.insert.bind(this));
    }
  }
  // 插入元素排序 不是完整数组排序
  insert(data) {
    const { container } = this;
    container.push(data);
    // 从最后一个数值开始进行比较 执行后是最大堆
    let index = container.length - 1;
    while (index) {
      // 找父元素
      let parent = Math.floor((index - 1) / 2);
      if (container[index] <= container[parent]) {
        break;
      }
      swap(container, index, parent);
      index = parent;
    }
  }
  // 移除堆顶元素
  extract() {
    const { container } = this;
    if (!container.length) {
      return null;
    }

    swap(container, 0, container.length - 1);
    const res = container.pop();
    const length = container.length;
    let index = 0, // 父节点
      left = index * 2 + 1; // 左子节点

    while (left < length) {
      // 如果有右节点，并且右节点的值大于左节点的值
      let right = index * 2 + 2;
      if (right < length && container[right] > container[left]) {
        left = right;
      }
      if (container[left] <= container[index]) {
        break;
      }
      swap(container, left, index);
      index = left;
      left = index * 2 + 1;
    }

    return res;
  }
  // 获取堆顶元素
  top() {
    if (this.container.length) return this.container[0];
    return null;
  }
}

// 获取topk
const getLeastNumbers = (arr, k) => {
  const length = arr.length;
  if (k >= length) {
    return arr;
  }

  // 创建大顶堆
  const heap = new MaxHeap(arr.slice(0, k));
  for (let i = k; i < length; ++i) {
    if (heap.top() > arr[i]) {
      heap.extract();
      heap.insert(arr[i]);
    }
  }
  return heap.container;
};
```

#### 复杂度

时间复杂度：O(nlogk) <br/>
空间复杂度：O(k)

### 解决方式 3

  <div style="color: #409EFF; fontSize: 18px; padding: 20px 0">
  利用快排的方式，主要是递归 + 分治的方式进行
  </div>

#### 代码讲解

1. 快排首先找一个哨兵位，插入一个哨兵位置或者就是拿第一位位哨兵，所以比如一个数组 arr = [1,2,3,4,5] ，往队头塞一个数进去，让首位是个哨兵，然后后面的 (1, arr.length - 1) 才是真正的数据。

2. 分为两个函数，一个是判断是否需要快排与基准位置，需要快排就执行左边与右边的划分递归函数，另一个是快排函数。

```js
const inventoryManagement = function (stock, cnt) {
  // 这里是放入哨兵的位置 后面的从1开始
  stock.unshift(-1);
  sorted(stock, 1, stock.length - 1);
  return stock.slice(1, cnt + 1);
};

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

#### 复杂度

时间复杂度：O(nlogn) <br/>
空间复杂度：O(n)

::: tip
综上第二种方式是最优解，时间复杂度最低，但是 1 和 3 的解决方式也更实用，根据实际需要选择最优解。
:::
