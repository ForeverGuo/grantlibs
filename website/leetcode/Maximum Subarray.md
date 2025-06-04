# 最大子数组和

### 问题描述

给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

子数组是数组中的一个连续部分。

### 解题方式

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        size = len(nums)
        if size == 0:
            return 0
        dp = [0 for _ in range(size)]
        dp[0] = nums[0]
        for i in range(1, size):
            if dp[i-1] >= 0:
                dp[i] = dp[i-1] + nums[i]
            else:
                dp[i] = nums[i]

        return max(dp)
```

### 复杂度

时间复杂度：O(n)
空间复杂度：O(n)
