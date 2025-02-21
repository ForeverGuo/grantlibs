# 20 有效的括号

### 解决方式

```python
def isValid(s: str) -> bool:
  if len(s) % 2 == 1:
    return False
  stack = []
  mapping = {")": "(", "}": "{", "]": "["}
  for char in s:
    if char in mapping:
      top_element = stack.pop() if stack else '#'
      if mapping[char] != top_element:
        return False
    else:
      stack.append(char)
  return not stack
```

### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(n)

# 678. 有效的括号字符串

### 解决方式

```python
def checkValidString(s: str) -> bool:
  left = 0
  right = 0
  for c in s:
    if c in '(*':
      left += 1
    else:
      left -= 1
    if left < 0:
      return False
  if left == 0:
    return True
  # 从右往左遍历
  for c in s[::-1]:
    # 如果是左括号或者星号
    if c in ')*':
      right += 1
    else:
      right -= 1
    if right < 0:
      return False
  return True
```

### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)
