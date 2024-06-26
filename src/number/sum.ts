import type { Call, Tuples } from 'hotscript'
/**
 * @description Calculates the sum of an array of numbers.
 * @author grantguo
 * @date 2024-04-21 23:09:23
 * 
 * Returns `NaN` if the input array is empty.
 * @example
 * sum([1, 2, 3, 4, 5]) // => 15
 * 
 * @param numbers The input array of numbers
 * @returns The sum of the input array 
 */

export function sum(numbers: number[]): number;
export function sum<TNum extends readonly number[]>(numbers: TNum): Call<Tuples.Sum, TNum>;
export function sum<TNum extends readonly number[]>(numbers: TNum): Call<Tuples.Sum, TNum> | number {
  if (numbers.length === 0) return NaN;
  return numbers.reduce((total, curr) => total + curr, 0)
}