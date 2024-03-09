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

这里是否想到了第三种解决方式呢...
