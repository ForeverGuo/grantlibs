# 删除链表的倒数第 N 个节点

### 解决方式

```python
def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
  left = right = head
  count = 0
  while count < n:
    right = right.next
    count += 1
  # 如果 n 等于链表长度, 直接返回 head.next
  if not right:
    return head.next
  while right.next:
    left = left.next
    right = right.next
  left.next = left.next.next
  return head
```

### 复杂度

- 时间复杂度: O(N)
- 空间复杂度: O(1)
