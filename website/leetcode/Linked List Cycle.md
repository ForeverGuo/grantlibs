# 环形链表

### 解决方式

```python
def hasCycle(self, head: Optional[ListNode]) -> bool:
  fast = slow = head
  while fast and fast.next:
    fast = fast.next.next
    slow = slow.next
    if slow == fast:
      return true
  return false
```

### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)
