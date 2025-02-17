# 最长无重复字符的子串

### 解决方式

```python
def lengthOfLongestSubstring(self, s: str) -> int:
    if not s:
      return 0
    left = 0
    lookup = set()
    max_len = 0
    for right in range(len(s)):
      # 如果右指针指向的字符已经在集合中，则移动左指针
      while s[right] in lookup:
        # 移除左指针指向的字符
        lookup.remove(s[left])
        left += 1
      max_len = max(max_len, right - left + 1)
      # 将右指针指向的字符添加到集合中
      lookup.add(s[right])
    return max_len
```

#### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(n)
