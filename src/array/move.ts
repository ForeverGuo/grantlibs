/**
 * Moves an element within an array.
 * @description move
 * @author grantguo
 * @date 2024-03-18 19:34:39
 * 
 * move([1, 2, 3, 4, 5], 0, 2);
 * // => [2, 3, 1, 4, 5]
 * 
 * @param array The input array
 * @param fromIndex Index of the element to move
 * @param toIndex Target index for the element
 * @return The modified array with the moved element
 * 
*/

export function move<Temp>(
  array: Temp[],
  fromIndex: number,
  toIndex: number
): Temp[] {
  if (fromIndex < 0 || fromIndex >= array.length)
    throw new Error(`Invalid 'fromIndex': ${fromIndex}. Must be between 0 and ${array.length - 1}.`);

  if (toIndex < 0 || toIndex >= array.length)
    throw new Error(`Invalid 'toIndex': ${toIndex}. Must be between 0 and ${array.length - 1}.`);

  if (toIndex === fromIndex) return array;

  const item = array[fromIndex]

  if (fromIndex < toIndex) {
    for (let index = fromIndex; index < toIndex; index++) {
      array[index] = array[index + 1]
    }
  } else {
    for (let index = fromIndex; index > toIndex; index--) {
      array[index] = array[index - 1]
    }
  }

  array[toIndex] = item

}

