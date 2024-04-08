# 链表是否有环

### 解决方式

```js
function hasCycle(head) {
  // write code here
  if (head == null || head.next == null) {
    return false;
  }

  let slow = head,
    fast = head;
  while (fast != null && fast.next != null) {
    fast = fast.next.next;
    slow = slow.next;
    if (slow == fast) {
      return true;
    }
  }
  return false;
}
```

#### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(1)
