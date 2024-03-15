/**
 * @description 根据size 返回对应size的二维数组
 * @author grantguo
 * @date 2024-03-15 16:44:24
 * 
 * @example
 * 
 * chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 * 
 * chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]  
 *
*/

export function chunk<Temp>(array: readonly Temp[], size: number): Temp[][] {

  const intSize = Math.trunc(size)

  if (array.length === 0 || intSize < 1) return [];

  let index = 0
  let resultIndex = 0
  const result = new Array(Math.ceil(array.length / size)) as Temp[][]

  while (index < array.length) {
    result[resultIndex++] = array.slice(index, index += intSize)
  }
  return result;
}

