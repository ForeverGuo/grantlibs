# 合并两个有序链表

### 解决方式

```python
def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
  if not list1: return list2
  if not list2: return list1
  if list1.value > list2.value:
    list2.next = self.mergeTwoLists(list1, list2.next)
    return list2
  else:
    list1.next = self.mergeTwoLists(list1.next, list2)
    return list1
```

### 复杂度

时间复杂度: O(n)
空间复杂度: O(n)
