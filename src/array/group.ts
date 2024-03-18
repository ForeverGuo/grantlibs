/**
 * Use the javascript "Object.groupBy()" version instead.
 * 
 * @description group
 * @author grantguo
 * @date 2024-03-18 19:07:16
 * 
 * @example
 * group([6.1, 4.2, 6.3], Math.floor)
 * // => { 4: [4.2], 6: [6.1, 6.3] }
 *
 * group([6.1, 4.2, 6.3], value => value > 5 ? '>5' : '<=5')
 * // => { '<=5': [4.2], '>5': [6.1, 6.3] }
 * 
*/

export function group<Temp, Tkey extends PropertyKey>(
  array: readonly Temp[],
  getGroupKey: (elem: Temp) => Tkey
): Record<Tkey, Temp[]> {
  const result = {} as Record<Tkey, Temp[]>

  for (const ele of array) {
    const key = getGroupKey(ele);
    (result[key] ??= []).push(ele)
  }

  return result
}
