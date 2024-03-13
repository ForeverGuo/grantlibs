
/**
 * @description 排序
 * @author grantguo
 * @date 2024-03-13 11:46:52
 * 
 * @example 
 * sort([1, 3, 2], { order: 'asc' })
 * // => [1, 2, 3]
 * 
 * // --- Sorting by multiple properties ---
 * sort([{a: 1, b: 2}, {a: 2, b: 4}], { order: 'des', by: item => item.b })
 * [{a: 2, b: 4}, {a: 1, b: 2}]
 * 
*/


export function sort<Temp>(
  array: readonly Temp[],
  ...other: { order?: "asc" | "des", by?: (Temp) => number | bigint | Date | string }[]): Temp[] {
  return [...array].sort((a, b) => {
    for (const { order = 'asc', by = (item: Temp) => item } of other) {
      const aValue = by(a)
      const bValue = by(b)
      if (aValue !== bValue) {
        const compare = aValue > bValue ? 1 : -1
        return order === 'asc' ? compare : -compare
      }
    }
    return 0
  })
}
