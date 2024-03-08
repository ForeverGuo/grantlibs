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
const swap = (arr, i, j) => {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

class MaxHeap {
  constructor(arr = []) {
    this.container = [];
    if (Array.isArray(arr)) {
      arr.forEach(this.insert.bind(this));
    }
  }

  insert(data) {
    const { container } = this;

    container.push(data);
    let index = container.length - 1;
    while (index) {
      let parent = Math.floor((index - 1) / 2);
      if (container[index] <= container[parent]) {
        break;
      }
      swap(container, index, parent);
      index = parent;
    }
  }

  extract() {
    const { container } = this;
    if (!container.length) {
      return null;
    }

    swap(container, 0, container.length - 1);
    const res = container.pop();
    const length = container.length;
    let index = 0,
      exchange = index * 2 + 1;

    while (exchange < length) {
      // 如果有右节点，并且右节点的值大于左节点的值
      let right = index * 2 + 2;
      if (right < length && container[right] > container[exchange]) {
        exchange = right;
      }
      if (container[exchange] <= container[index]) {
        break;
      }
      swap(container, exchange, index);
      index = exchange;
      exchange = index * 2 + 1;
    }

    return res;
  }

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
