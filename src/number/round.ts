/**
 * @description Rounds a number to the given precision
 * @author grantguo
 * @date 2024-04-24 18:12:12
 * 
 * @example
 * round(1.23456, 2); // => 1.23
 * round(1.235, 1); // => 1.2
 * round(1234.56); // => 1234.56
 * 
*/
export function round(number: number, precision = 2): number {
  const factor = Math.pow(10, precision);
  return Math.round((number + Number.EPSILON) * factor) / factor
}