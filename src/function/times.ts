/**
 * @description 执行函数次数 并返回数组
 * @author grantguo
 * @date 2024-04-01 21:14:17
 * 
 * @example
 * times(index => console.log("Run", index), 3)
 * // => "Run 0" | "Run 1" | "Run 2"
 * times(Math.random, 3)
 * // => [0.123, 0.456, 0.789]
 * times(() => 0, 4)
 * // => [0, 0, 0, 0]
 * 
*/

export function times<TInput>(func: (index: number) => TInput, n: number): TInput[] {
  const res: TInput[] = [];
  for (let i = 0; i < n; i++) {
    res.push(func(i))
  }

  return res;
}
