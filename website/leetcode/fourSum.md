# 四数之和

### python3 解决方式

```python
def fourSum(nums, target):
    if len(nums) < 4:
        return []
    nums.sort()
    res = []
    length = len(nums)
    # 遍历数组
    # 为了避免重复，所以i的范围是length - 3
    for i in range(length - 3):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        # 如果当前数字与后三个数字之和大于target，则结束循环
        if nums[i] + nums[i+1] + nums[i+2] + nums[i+3] > target:
            break
        # 如果当前数字与后三个数字之和小于target，则跳过
        if nums[i] + nums[length - 3] + nums[length - 2] + nums[length - 1] < target:
            continue
        for j in range(i+1, length - 2):
            if j > i+1 and nums[j] == nums[j-1]:
                continue
            # 如果当前数字与后两个数字之和大于target，则结束循环
            if nums[i] + nums[j] + nums[j+1] + nums[j+2] > target:
                break
            # 如果当前数字与后两个数字之和小于target，则跳过
            if nums[i] + nums[j] + nums[length - 2] + nums[length - 1] < target:
                continue
            left, right = j+1, len(nums) - 1
            while left < right:
                curr_sum = nums[i] + nums[j] + nums[left] + nums[right]
                if curr_sum == target:
                    res.append([nums[i], nums[j], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left+1]:
                      left += 1
                    while left < right and nums[right] == nums[right-1]:
                      right -= 1
                    left += 1
                    right -= 1
                elif curr_sum < target:
                    left += 1
                else:
                    right -= 1
    return res
```

#### 复杂度

时间复杂度：O(n^3) <br/>
空间复杂度：O(n)
