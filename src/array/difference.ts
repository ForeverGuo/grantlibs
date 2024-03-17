/**
 * @description 创建一个具有唯一array值的数组
 * @author grantguo
 * @date 2024-03-17 21:48:23
 * 
 * @example
 * difference([3, 2, 1], [4, 2], [5])
 * // => [3, 1]
 * 
 * // ---- Custom compare function ----
 * const compareByFloor = (a, b) => Math.floor(a) === Math.floor(b);
 * difference([1.2, 3.1], [1.3, 2.4], compareByFloor)
 * // => [3.1]
 * 
 * // ---- Only compare by id ----
 * const arr1 = [{ id: 1, name: 'Yeet' }, { id: 3, name: 'John' }];
 * const arr2 = [{ id: 3, name: 'Carl' }, { id: 4, name: 'Max' }];
 *
 * difference(arr1, arr2, (a, b) => a.id === b.id)
 * // => [{ id: 1, name: 'Yeet' }]
 * 
*/

export function difference<Temp>(
  array: readonly Temp[],
  ...others: any[]
): unknown[] {
  const fn = others[others.length - 1]

  if (typeof fn !== 'function') {
    const rest = new Set(others.flat(Infinity))
    return array.filter(val => !rest.has(val))
  }

  const array2 = others.shift()
  const differenceRest: unknown[] = []

  for (const ele of array) {
    if (array2.every(compareEle => !fn(ele, compareEle))) {
      differenceRest.push(ele)
    }
  }
  return differenceRest;
}

