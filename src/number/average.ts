
/**
 * @description Calculates the average of an array of numbers
 * @author grantguo
 * @date 2024-04-22 21:21:21
 * 
 * @example
 * average([1, 2, 3, 4, 5]) // => 3
 * 
*/

import { sum } from "./sum";

export function average(numbers: readonly number[]): number {
  if (numbers.length === 0) {
    return NaN;
  }
  return sum(numbers) / numbers.length;
}