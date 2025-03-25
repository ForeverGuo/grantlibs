# 奇偶链表

### 解决方式

```python
def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
	if not head or not head.next:
		return head
	odd_list = head
	even_list = head.next
	even_head = even_list
	while even_list and even_list.next:
		odd_list.next = even_list.next
		odd_list = odd_list.next
		even_list.next = odd_list.next
		even_list = even_list.next
	odd_list.next = even_head
	return head
```

### 复杂度

时间复杂度：O(n)
空间复杂度：O(1)
