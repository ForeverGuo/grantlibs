### 对称二叉树判断

### 递归方式

```js
function isSymmetric(root) {
  // write code here
  if (root == null) {
    return true;
  }

  return compare(root.left, root.right);
}

function compare(left, right) {
  if (left && right == null) {
    return false;
  } else if (left == null && right) {
    return false;
  } else if (left == null && right == null) {
    return true;
  }

  return (
    left.val == right.val &&
    compare(left.left, right.right) &&
    compare(left.right, right.left)
  );
}
```

#### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(n)

#### 迭代方式
