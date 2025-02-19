# 回文串

## 409 最长回文串

### python3 解决方式

```python
def longestPalindrome(s):
  counter = collections.defaultdict(int)
  for i in s:
    counter[i] += 1
  res, odd = 0 ,0
  print(counter)
  for count in counter.values():
    # 计算当前字母是奇数还是偶数
    rem = count % 2
    # 如果有余数, 则说明是奇数, 则减去当前的余数
    res += count - rem
    # 如果是奇数, 则将 odd 置 1
    if rem == 1: odd = 1
  return res + odd
```

#### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)

## 5 最长回文子串

### python3 解决方式 - 中心扩展法

```python
def longestPalindrome2(s):
  def expand_around_center(l, r):
    while l >= 0 and r < len(s) and s[l] == s[r]:
      l -= 1
      r += 1
    return s[l+1:r]
  n = len(s)
  max_str = ""
  for i in range(n):
    s1 = expand_around_center(i, i)
    s2 = expand_around_center(i, i+1)
    max_str = max(s1, s2, max_str, key=len)

  return max_str
```

时间复杂度：O(n^2) <br/>
空间复杂度：O(1)

### 动态规划法

```python
def longestPalindrome3(s):
  n = len(s)
  if n < 2:
    return s

  # 初始化dp规划表
  dp = [[False] * n for _ in range(n)]
  longest = ""

  # 针对长度为 1
  for i in range(n):
    dp[i][i] = True
    longest = s[i]

  # 针对长度为 2
  for i in range(n-1):
    if s[i] == s[i+1]:
      dp[i][i+1] = True
      longest = s[i:i+2]

  # 针对长度 大于 2
  for length in range(3, n+1):
    for i in range(n-length+1): # 字符串起始位置
      j = i + length - 1 # 字符串结束位置
      if s[i] == s[j] and dp[i+1][j-1]:
        dp[i][j] = True
        if length > len(longest):
          longest = s[i:j+1]

  return longest
```

时间复杂度：O(n^2) <br/>
空间复杂度：O(n^2)
