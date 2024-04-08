# 两数之和

### 解决方式

```js
function twoSum(numbers, target) {
  // write code here
  let map = new Map();
  for (let i = 0; i < numbers.length; i++) {
    let diff = target - numbers[i];
    if (map.has(diff)) {
      return [map.get(diff), i + 1];
    } else {
      // 做位置存储
      map.set(numbers[i], i + 1);
    }
  }
}
```

#### 复杂度

时间复杂度：O(n) <br/>
空间复杂度：O(n)
