/**
 * @description 返回唯一的数组
 * @author grantguo
 * @date 2024-03-14 10:33:27
 * @returns Array[]
 * 
 * A compare function is optional (default is `===`).
 * 
 * @example
 * 
 * unique([1, 2, 2, 3])
 * => [1, 2, 3]
 * 
 * const arr = [
 *  { id: 1, name: 'tiny' },
 *  { id: 1, name: 'john' },
 *  { id: 3, name: 'tiny' },
 * ]
 * 
 * unique(arr, isEqual)
 * => [{ id: 1, name: 'tiny' }, { id: 2, name: 'tiny' }]
 * 
 * unique(arr, (a, b) => a.name === b.name)
 * => [{ id: 1, name: 'tiny' }, { id: 1, name: 'john' },]
 * 
*/

export function unique<Temp>(
  array: readonly Temp[],
  compareFn?: (a: Temp, b: Temp) => boolean): Temp[] {
  if (!compareFn) {
    return [...new Set(array)];
  }

  const uniqueArr: Temp[] = []

  for (const item of array) {
    if (!uniqueArr.some(uniqueValue => compareFn(uniqueValue, item))) {
      uniqueArr.push(item)
    }
  }

  return uniqueArr;
}







