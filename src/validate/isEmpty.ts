/**
 * @description Check value is Empty
 * @author grantguo
 * @date 2024-04-19 15:57:57
 * 
 * @example
 * isEmpty(null)
 * // => true
 *
 * isEmpty({})
 * // => true
 *
 * isEmpty("")
 * // => true
 *
 * isEmpty([1, 2, 3])
 * // => false
 *
 * isEmpty('abc')
 * // => false
 *
 * isEmpty({ 'a': 1 })
 * // => false
 * 
*/

export function isEmpty(value: string | null | object | undefined): boolean {
  if (typeof value === null || typeof value === undefined) return true;

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }

  if (value instanceof Set || value instanceof Map) {
    return value.size === 0
  }

  if (ArrayBuffer.isView(value)) {
    return value.byteLength === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false;
}
