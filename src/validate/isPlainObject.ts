import type { PlainObject } from "../type";

/**
 * @description isPlainObject
 * @author grantguo
 * @date 2024-04-30 09:48:46
*/
export function isPlainObject(value: unknown): value is PlainObject {
  return value?.constructor === Object
}