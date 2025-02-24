# 螺旋矩阵

### 解决方式

```python
def spiralOrder(matrix):
    if not matrix:
        return []

    result = []
    top, bottom = 0, len(matrix) - 1  # 上下边界
    left, right = 0, len(matrix[0]) - 1  # 左右边界

    while top <= bottom and left <= right:
        # 从左到右遍历上边界
        for i in range(left, right + 1):
            result.append(matrix[top][i])
        top += 1  # 上边界下移

        # 从上到下遍历右边界
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1  # 右边界左移

        if top <= bottom:
            # 从右到左遍历下边界
            for i in range(right, left - 1, -1):
                result.append(matrix[bottom][i])
            bottom -= 1  # 下边界上移

        if left <= right:
            # 从下到上遍历左边界
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1  # 左边界右移

    return result
```

### 复杂度

时间复杂度：O(m\*n) <br/>
空间复杂度：O(1)
