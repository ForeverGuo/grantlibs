# 链表之两数相加

### 解决方式

```python
def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
  dummy = ListNode(0)
  curr = dummy
  # 进位处理
  carry = 0
  while l1 or l2 or carry:
    sum = carry
    if l1:
      sum += l1.val
      l1 = l1.next
    if l2:
      sum += l2.val
      l2 = l2.next
    carry = int(sum / 10)
    curr.next = ListNode(int(sum % 10))
    curr = curr.next
  return dummy.next
```

### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)
