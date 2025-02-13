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

### python3 解决方式

- 暴力解决

```python
def twoSum(self, nums: List[int], target: int) -> List[int]:
  for(i,num) in enumerate(nums):
    for(j,num2) in enumerate(nums):
      if i != j and num + num2 == target:
        return [i, j]
```

- 哈希表法

```python
def twoSum(self, nums: List[int], target: int) -> List[int]:
  nums_dict = {}
  for i in range(len(nums)):
    if nums[i] in nums_dict:
      return [nums_dict[nums[i]], i]
    nums_dict[target - nums[i]] = i
```

- 双指针法

```python
 def twoSum(self, nums: List[int], target: int) -> List[int]:
  list_nums = list(enumerate(nums))
  list_nums.sort(key=lambda x: x[1])
  left,right = 0,len(nums) - 1
  while left < right:
    curr_sum = list_nums[left][1] + list_nums[right][1]
    if curr_sum == target:
      return[list_nums[left][0], list_nums[right][0]]
    elif curr_sum < target:
      left +=1
    else:
      right -= 1
```
