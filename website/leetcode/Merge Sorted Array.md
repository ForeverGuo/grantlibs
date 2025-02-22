# 88 合并两个有序数组

### 解决方式

```python
def merge(nums1, m, nums2, n):
    """
    合并两个有序数组到 nums1 中。
    :param nums1: 第一个有序数组，长度为 m + n
    :param m: nums1 中的有效元素个数
    :param nums2: 第二个有序数组，长度为 n
    :param n: nums2 中的元素个数
    """
    p1 = m - 1  # nums1 的最后一个有效元素
    p2 = n - 1  # nums2 的最后一个元素
    p = m + n - 1  # nums1 的最后一个位置

    # 从后向前合并
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1

    # 如果 nums2 中还有剩余元素，直接复制到 nums1 中
    nums1[:p2 + 1] = nums2[:p2 + 1]

# 测试
nums1 = [1, 2, 3, 0, 0, 0]
m = 3
nums2 = [2, 5, 6]
n = 3
merge(nums1, m, nums2, n)
print(nums1)  # 输出: [1, 2, 2, 3, 5, 6]
```

### 复杂度

时间复杂度：O(m+n) <br/>
空间复杂度：O(1)
