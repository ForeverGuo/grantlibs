# 192 字符串转换整数

### 解决方式

```python
# 首部空格
# 符号位
# 非数字字符
# 数字字符
def myAtoi(str):
  str = str.strip()
  if not str:
     return 0

  # 最大值, 最小值, 越界值
  int_max, int_min, bundry = 2**31-1, -2**31, 2**31 // 10

  res, i, sign = 0, 1, 1

  if str[0] == '-':  # 如果是负数
     sign = -1
  elif str[0] != '+': # 如果没有符号
     i = 0

  for c in str[i:]:
     if not '0' <= c <= '9':
        break
     if res > bundry or res == bundry and c > '7':
        return int_max if sign == 1 else int_min
     res = 10 * res + ord(c) - ord('0')  # 数字拼接
  return sign * res
```

#### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(n)
