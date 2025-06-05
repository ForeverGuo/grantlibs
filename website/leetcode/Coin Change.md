# 零钱兑换 (322)

### 问题描述

给定不同面额的硬币 coins 和一个总金额 amount。编写一个函数来计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1。

你可以认为每种硬币的数量是无限的。

示例 1：
输入：coins = [1, 2, 5], amount = 11
输出：3
解释：11 = 5 + 5 + 1

### 解决方式

```python
class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # 1. 状态定义和初始化
        # dp[i] 表示凑成金额 i 所需的最少硬币个数
        # 初始化 dp 数组，长度为 amount + 1，所有元素设为 amount + 1
        # amount + 1 是一个比任何可能结果都大的值，表示目前无法凑成
        # 凑成 amount 最多需要 amount 个硬币 (如果所有硬币都是1)
        # 所以 amount + 1 可以作为“无穷大”的标记
        dp = [amount + 1] * (amount + 1)

        # 2. base case
        # 凑成金额 0 需要 0 个硬币
        dp[0] = 0

        # 3. 遍历所有金额 i (从 1 到 amount)
        # 外层循环遍历目标金额，从 1 到 amount
        for i in range(1, amount + 1):
            # 4. 遍历所有硬币面额 coin
            # 内层循环遍历每一种硬币面额
            for coin in coins:
                # 5. 状态转移方程
                # 如果当前金额 i 大于或等于硬币面额 coin
                # 且 dp[i - coin] 不是“无法凑成”的状态（即不是 amount + 1）
                if i >= coin and dp[i - coin] != amount + 1:
                    # 那么就可以尝试使用这个硬币来凑成金额 i
                    # 凑成 i 的硬币数 = 凑成 (i - coin) 的硬币数 + 1 (当前这个 coin)
                    # 我们取所有可能凑法中的最小值
                    dp[i] = min(dp[i], dp[i - coin] + 1)

        # 6. 返回结果
        # 如果 dp[amount] 仍然是初始的“无穷大”值 (amount + 1)
        # 说明总金额 amount 无法凑成，返回 -1
        if dp[amount] == amount + 1:
            return -1
        else:
            # 否则，返回凑成总金额所需的最少硬币个数
            return dp[amount]
```

### 复杂度

时间复杂度：O(amount \* coins.length)
空间复杂度：O(amount)

# 零钱兑换(518)

### 问题描述

给定不同面额的硬币 coins 和一个总金额 amount。编写一个函数来计算可以凑成总金额所需要的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1。

### 解决方式

```python
class Solution:
    def change(self, amount: int, coins: list[int]) -> int:
        # 1. 状态定义和初始化
        # dp[i] 表示凑成金额 i 的组合数
        # 初始化 dp 数组，长度为 amount + 1
        # 所有元素初始为 0
        dp = [0] * (amount + 1)

        # 2. base case
        # 凑成金额 0 有 1 种组合方式（即不使用任何硬币，空集）
        dp[0] = 1

        # 3. 遍历所有硬币面额 coin
        # 这一层循环至关重要，它确保了组合的顺序性，避免重复
        for coin in coins:
            # 4. 遍历所有金额 i (从 coin 到 amount)
            # 对于当前硬币 coin，我们只考虑它可以参与凑成的金额
            # 从 coin 开始，因为如果金额 i < coin，那么当前硬币无法使用
            for i in range(coin, amount + 1):
                # 5. 状态转移方程
                # dp[i] 的值累加上使用当前 coin 得到的组合数
                # dp[i - coin] 表示凑成金额 (i - coin) 的组合数
                # 加上当前这个 coin，就形成了凑成 i 的新组合
                dp[i] += dp[i - coin]

        # 6. 返回结果
        # dp[amount] 存储的就是凑成总金额 amount 的硬币组合数
        return dp[amount]
```
