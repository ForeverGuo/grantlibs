/**
 * @description isEqual (判断基本类型 时间 日期 对象 数组)
 * @author grantguo
 * @date 2024-04-10 19:31:06
*/

import { isSameType } from "../utils";
import { isObject } from "./isObject";

const map: Map<unknown, unknown> = new Map()
export function isEqual(a: unknown, b: unknown): boolean {

  // primitive value
  if (!isObject(a) || !isObject(b)) {
    return a === b;
  }

  if (a === b) { return true }

  // is same type
  if (!isSameType(a, b)) {
    return false
  }
  // is Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  // is map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (let key of a.keys()) {
      if (!b.has(key) || a.get(key) !== b.get(key)) return false;
    }
    return true
  }

  // is set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (let val of a.values()) {
      if (!b.has(val)) return false;
    }
    return true
  }

  // support circular reference in array and object
  if (map.has(a) || map.has(b)) {
    return true
  }

  map.set(a, b);


  const aKeys = [...Object.keys(a), ...Object.getOwnPropertySymbols(a)]
  const bKeys = [...Object.keys(b), ...Object.getOwnPropertySymbols(b)]

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (let i = 0; i < aKeys.length; i++) {
    const aKey = aKeys[i]
    const bKey = bKeys[i]
    if (aKey !== bKey) return false;
    const res = isEqual(a[aKey], b[bKey])
    if (!res) {
      return false
    }
  }

  return true
}


