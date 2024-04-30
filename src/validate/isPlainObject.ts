const _toString = Object.prototype.toString

/**
 * @description isPlainObject
 * @author grantguo
 * @date 2024-04-30 09:48:46
*/
export function isPlainObject(obj: any): boolean {
  return _toString.call(obj) === '[object Object]';
}