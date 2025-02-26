# 反转链表

### 解决方式

```python
def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
  if head == None:
    return None
  pre, curr = null, head
  while curr:
    temp = curr.next
    curr.next = pre
    pre = curr
    curr = temp
  return pre
```

### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)

### 解决方式 递归

```python
def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
  def wlink(curr, pre):
    if not curr: return pre
    res = wlink(curr.next, curr) # 递归后继节点
    curr.next = pre
    return res
  return wlink(head, None)
```

### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(n)
