const _toString = Object.prototype.toString

/**
 * @description isPromise
 * @author grantguo
 * @date 2024-03-09 22:28:01
*/
export function isPromise(p: any): boolean {
  return _toString.call(p) === '[object Promise]'
}