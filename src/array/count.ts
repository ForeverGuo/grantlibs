/**
 * @description 返回指定属性及出现的次数
 * @author grantguo
 * @date 2024-03-16 19:46:01
 * 
 * @example
 * 
 * const array = [
 *  { id: 1, name: 'hony', active: true },
 *  { id: 2, name: 'hony', active: false },
 *  { id: 1, name: 'tony', active: true },
 * ]
 * count(array, value => value.active ? 'active' : 'inactive')
 * => { 'active': 2, 'inactive': 1 }
 * 
 * count(array, value => value.id)
 * => { 1: 2, 2: 1 }
 * 
 * 
*/

export function count<Temp, Tkey extends PropertyKey>(
  array: readonly Temp[],
  check: (value: Temp) => Tkey
): Record<Tkey, number> {
  const result = {} as Record<Tkey, number>;

  for (const value of array) {
    const key = check(value)
    result[key] = (result[key] ?? 0) + 1
  }

  return result;
}


