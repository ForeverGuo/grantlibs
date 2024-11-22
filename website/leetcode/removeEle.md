# 移除元素

### 问题描述

给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素。元素的顺序可能发生改变。然后返回 nums 中与 val 不同的元素的数量。

### 链接

[移除元素链接](https://leetcode.cn/problems/remove-element/description/)

### 解决方式

```js
class Solution {
    public int removeElement(int[] nums, int val) {
        int fast = 0, slow = 0;
        int size = nums.length;

        for(int i=0; i<size;) {
            if (nums[i] == val) {
                nums[i] = nums[size - 1];
                size--;
            } else {
                i++;
            }
        }
        return size;
    }
}
```

### 复杂度

时间复杂度: O(n) <br>
空间复杂度: O(1)

### 相关练习题目

[leetcode-26](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/) - easy <br>
[leetcode-283](https://leetcode.cn/problems/move-zeroes/description/) - easy
