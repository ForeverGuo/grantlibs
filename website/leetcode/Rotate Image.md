# 旋转图像

### 解决方式

```python
def rotate(matrix):
  n = len(matrix)
  for i in range(n):
    for j in range(i, n):
      matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

  for i in range(n):
    matrix[i] = matrix[i][::-1]
```

### 复杂度

时间复杂度：O(n^2) <br/>
空间复杂度：O(1)
