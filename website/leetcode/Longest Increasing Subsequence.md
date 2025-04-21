# 最长递增子序列

## 题目描述

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">

给你一个整数数组 nums，找到其中最长严格递增子序列的长度。

子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。

</div>

## 方法一 ：动态规划(O(n^2) 时间复杂度)

1. 定义状态

dp[i] 表示以 nums[i] 结尾的最长递增子序列的长度。

2. 初始化

对于数组中的每个元素，以它自身结尾的递增子序列的长度至少为 1。因此，我们将 dp 数组的所有元素初始化为 1。

3. 状态转移方程

对于每个 i (从 1 到 n-1)，我们需要遍历它之前的所有元素 j (从 0 到 i-1)。如果 nums[i] > nums[j]，这意味着我们可以将 nums[i] 添加到以 nums[j] 结尾的递增子序列的后面，形成一个新的更长的递增子序列。因此，我们可以更新 dp[i] 的值为 max(dp[i], dp[j] + 1)。

4. 返回结果

遍历完整个 nums 数组后，dp 数组中最大的值就是最长递增子序列的长度。

## 代码实现

```python
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
      if not nums:
        return 0
      n = len(nums)
      dp = [1] * n
      for i in range(n)
        for j in range(i):
          if nums[i] > nums[j]:
            dp[i] = max(dp[i], dp[j] + 1)
      return max(dp) if dp else 0
```

## 方法二：动态规划（O(nlogn) 时间复杂度）

这种方法维护一个列表 tails，其中 tails[i] 是长度为 i+1 的所有递增子序列的最小尾部元素。

1. 初始化
   tails 是一个空列表。

2. 遍历 nums 数组

对于每个 num in nums:

- 如果 tails 为空或者 num 大于 tails 的最后一个元素，这意味着我们可以将 num 扩展到当前最长的递增子序列的末尾，所以我们将 num 添加到 tails 中。

- 如果 num 小于或等于 tails 中的某个元素，我们希望找到一个长度相同的递增子序列，其尾部元素尽可能小，这样更有利于后续元素的扩展。我们可以使用二分查找在 tails 中找到第一个大于或等于 num 的元素，并用 num 替换它。这样做不会改变当前最长递增子序列的长度，但它使得相同长度的递增子序列的尾部更小。

3. 结果

遍历完 nums 数组后，tails 的长度就是最长递增子序列的长度。

```python
import bisect

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
      tails = []
      for num in nums:
        if not tails or num > tails[-1]:
          tails.append(num)
        else:
          idx = bisect.bisect_left(tails, num)
          tails[idx] = num
      return len(tails)
```

## 复杂度分析:

- 动态规划

  - 时间复杂度：两层循环，O(n^2)。
  - 空间复杂度：需要一个长度为 n 的 dp 数组，O(n)。

- 动态规划 + 二分查找
  - 时间复杂度：遍历 nums 数组需要 O(n)，每次在 tails 中进行二分查找需要 O(log n)，总的时间复杂度为 O(nlogn)。
  - 空间复杂度：需要一个 tails 列表，最坏情况下其长度可能为 n，O(n)。
