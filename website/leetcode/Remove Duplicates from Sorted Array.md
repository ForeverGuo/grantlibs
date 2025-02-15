# 删除排序数组中的重复项

## 26

### python3 解决方式 之 双指针

```python
def removeDuplicates(nums):
    if len(nums) == 0:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[slow] != nums[fast]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1
```

### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)

## 80

### python3 解决方式 之 计数

```python
def removeDuplicates(nums):
    if len(nums) == 0:
        return 0
    slow = 0
    count = 1
    for fast in range(1, len(nums)):
        if nums[fast] == nums[slow]:
            count += 1
        else:
            count = 1
        if count <= 2:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1
```

### python3 解决方式 之 双指针

```python
def removeDuplicates2(nums):
    n = len(nums)
    if n <= 2:
        return n
    slow = 2
    fast = 2
    while fast < n:
        if nums[slow - 2] != nums[fast]:
            nums[slow] = nums[fast]
            slow += 1
        fast += 1
    return slow
```
