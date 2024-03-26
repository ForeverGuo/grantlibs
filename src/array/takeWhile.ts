/**
 * @description 返回 array 数组的切片
 * @author grantguo
 * @date 2024-03-26 14:26:02
 * 
 * @example
 * 
 * var users = [
 *  { 'user': 'barney',  'active': false },
 *  { 'user': 'fred',    'active': false},
 *  { 'user': 'pebbles', 'active': true }
 * ];
 * takeWhile(users, user => user.active)
 * // => Objects for ['pebbles']
 * 
*/

export function takeWhile<Temp>(
  array: Temp[],
  fn: (val: Temp) => boolean
): Temp[] {
  return array.filter(arrItem => fn(arrItem))
}
