# 爬楼梯

### 解决方式

```python
# 爬楼梯
def climbStairs(self, n: int) -> int:
  a, b = 1, 1
  for _ in range(n-1):
    a, b = b, a + b
  return b

# 斐波那契数列
def fibonacci(n):
  a, b = 0, 1
  for _ in range(n):
    a, b = b, a + b
  return a
```

### 复杂度

时间复杂度：O(n^2) <br/>
空间复杂度：O(1)
