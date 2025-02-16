# 盛最多水的容器（Container With Most Water）

### 解决方式

- 双指针

```python
def maxArea(height):
    max_area = 0
    left = 0
    right = len(height) - 1
    while left < right:
        max_area = max(max_area, min(height[left], height[right]) * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area
```

#### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)

- 暴力解法

```python
def maxArea2(height):
  max_area = 0
  for i in range(len(height)):
    for j in range(i+1, len(height)):
      max_area = max(max_area, min(height[i], height[j]) * (j - i))
  return max_area
```

#### 复杂度

时间复杂度：O(n^2) <br/>
空间复杂度：O(n)
