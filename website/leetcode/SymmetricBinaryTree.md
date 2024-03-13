### 对称二叉树判断

### 解决方式一

<div style="color: #409EFF; fontSize: 18px; padding: 20px 0">
  函数递归方式  
</div>

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
