# 三数之和

### python3 解决方式

```python
def threeSum(nums, target):
    nums.sort()
    res = []
    for i in range(len(nums)):
        # 如果当前数字大于0，则三数之和一定大于0，所以结束循环
        # 如果当前数字与前一个数字相同，则跳过
        # 因为已经计算过了
        if i > 0 and nums[i] == nums[i-1]:
            continue
        # 定义左右指针
        left, right = i + 1, len(nums) - 1
        while left < right:
            curr_sum = nums[i] + nums[left] + nums[right]
            if curr_sum == target:
                res.append([nums[i], nums[left], nums[right]])
                # 去重
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                # 去重
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                # 移动指针
                left += 1
                right -= 1
            elif curr_sum < target:
                left += 1
            else:
                right -= 1
    return res
```

### 复杂度

时间复杂度：O(n^2) <br/>
空间复杂度：O(n)
