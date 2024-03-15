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

<div style="color: #E6A23C; fontSize: 18px; padding: 20px 0">
  根据栈维护两个root，分别进行叶子节点的对比，保证栈内队列的长度。
  对称是判断左节点的左子节点和右节点的右子节点进行比较是否
</div>

```js
var checkSymmetricTree = function (root) {
  const arr = [root, root];
  return checkTwo(arr);
};

const checkTwo = (list) => {
  while (list.length) {
    const u = list.pop();
    const v = list.pop();
    if (u === null && v === null) {
      continue;
    }
    if (u == null || v == null || u.val != v.val) {
      return false;
    }

    list.push(u.left);
    list.push(v.right);

    list.push(u.right);
    list.push(v.left);
  }

  return true;
};
```

#### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(n)
