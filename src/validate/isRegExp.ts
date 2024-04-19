const _toString = Object.prototype.toString

/**
 * @description isRegExp
 * @author grantguo
 * @date 2024-03-09 22:23:25
*/
export function isRegExp(v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}