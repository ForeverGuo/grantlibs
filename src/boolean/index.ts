const _toString = Object.prototype.toString

/**
 * @description isObject
 * @author grantguo
 * @date 2024-03-09 22:21:07
*/
export function isObject(obj: any): boolean {
  return _toString.call(obj) === '[object Object]';
}

/**
 * @description isRegExp
 * @author grantguo
 * @date 2024-03-09 22:23:25
*/
export function isRegExp(v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * @description isDef
 * @author grantguo
 * @date 2024-03-09 22:25:00
*/
export function isDef(v: any): boolean {
  return v !== undefined && v !== null
}

/**
 * @description isPromise
 * @author grantguo
 * @date 2024-03-09 22:28:01
*/
export function isPromise(p: any): boolean {
  return _toString.call(p) === '[object Promise]'
}
