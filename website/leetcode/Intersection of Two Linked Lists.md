# 相交链表

### 解决方式

```python
def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
  p1, p2 = headA, headB
  while p1 != p2:
    p1 = p1.next if p1 else headB
    p2 = p2.next if p2 else headA
  return p1
```

### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)
