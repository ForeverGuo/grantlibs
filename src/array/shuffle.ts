/**
 * @description 对数组内位置重新洗牌
 * @author grantguo
 * @date 2024-03-28 09:36:05
 * 
 * @example
 * shuffle([1, 2, 3, 4])
 * // => [4, 1, 3, 2]
 * 
*/

export function shuffle<Temp>(array: readonly Temp[]): Temp[] {
  const shuffledArray = [...array];
  const len = shuffledArray.length - 1
  for (let index = len; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * index);
    [shuffledArray[index], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[index]]
  }

  return shuffledArray;
}
