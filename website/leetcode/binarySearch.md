# 二分查找

### 问题描述

给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

### 链接

[二分法链接](https://leetcode.cn/problems/binary-search/description/)

### 解决方式

#### 左闭右闭

```js
class Solution {
    public int search(int[] nums, int target) {
        int i = 0;
        int j = nums.length - 1;
        while(i <= j) {
            int m = (i + j) / 2;
            if (nums[m] < target) i = m + 1;
            else if (nums[m] > target) j = m - 1;
            else return m;
        }
        return -1;
    }
}
```

#### 左闭右开

```js
class Solution {
    public int search(int[] nums, int target) {
        int i = 0;
        int j = nums.length;
        while(i < j) {
            int m = i + ((j - i) >> 1);
            if (nums[m] == target) return m;
            if (nums[m] > target) j = m;
            if (nums[m] < target) i = m + 1;
        }
        return -1;
    }
}
```

### 复杂度

时间复杂度: O(logN) <br>
空间复杂度:O(1)

### 相关练习题目

[leetcode-35](https://leetcode.cn/problems/search-insert-position/description/) - easy <br>
[leetcode-34](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/) - medium <br>
[leetcode-69](https://leetcode.cn/problems/sqrtx/description/) - easy <br>
[leetcod-367](https://leetcode.cn/problems/valid-perfect-square/description/) - easy
