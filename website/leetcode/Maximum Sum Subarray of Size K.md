# Maximum Sum Subarray of Size K

### 问题描述

 <div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  Problem Statement：
  Given an array of positive numbers and a positive number ‘k’, find the maximum sum of any contiguous subarray of size ‘k’.

Example 1:
Input: [2, 1, 5, 1, 3, 2], k=3
Output: 9
Explanation: Subarray with maximum sum is [5, 1, 3].

Example 2:
Input: [2, 3, 4, 1, 5], k=2
Output: 7
Explanation: Subarray with maximum sum is [3, 4].

 </div>

### 解决方式一

```js
const max_sub_array_of_size_k = function (arr, k) {
  const [start, sum, max_sum] = [0, 0, 0];
  for (let end = 0; end < arr.length; end++) {
    sum += arr[end];
    if (end >= k - 1) {
      max_sum = Math.max(sum, max_sum);
      sum -= arr[start];
      start += 1;
    }
  }
  return max_sum;
};
```

#### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)
