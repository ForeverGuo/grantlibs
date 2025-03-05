# 环形链表 II

### 解决方式

```python
def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
  fast = slow = head
  while head and head.next:
    slow = slow.next
    fast = fast.next.next
    # 有环则相遇
    if fast == slow:
      slow = head
      while slow != fast:
        slow = slow.next
        fast = fast.next
      return slow
  return None
```

### 复杂度

时间复杂度: O(N)
空间复杂度: O(1)
