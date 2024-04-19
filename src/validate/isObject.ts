const _toString = Object.prototype.toString

/**
 * @description isObject
 * @author grantguo
 * @date 2024-03-09 22:21:07
*/
export function isObject(obj: any): boolean {
  // return _toString.call(obj) === '[object Object]';
  // function map set object array
  return typeof obj === 'object' && obj !== null
}