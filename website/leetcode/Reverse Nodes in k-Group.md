# K 个一组翻转链表

### 解决方式

```python
def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
    if not head or not head.next or k == 1:
        return head
    # 空链表
    finalList = ListNode(None)
    finalList.next = head
    pre = finalList
    while head:
        tail = pre
        for _ in range(k):
            tail = tail.next
            if not tail:
                return finalList.next
        nexead = tail.next
        [head, tail] = self.reverseNode(head, tail)
        # 重新定义head 和 tail的next
        pre.next = head
        tail.next = nexead
        pre = tail
        head = tail.next
    return finalList.next

# 指定反转 k 个节点
def reverseNode(self, head: Optional[ListNode], tail: Optional[ListNode]):
    # 最后一个节点
    pre = tail.next
    # 首节点
    p = head
    while pre != tail:
        temp = p.next
        p.next = pre
        pre = p
        p =  temp
    return [tail, head]

```

### 复杂度

时间复杂度：O(n^2)
空间复杂度：O(1)
