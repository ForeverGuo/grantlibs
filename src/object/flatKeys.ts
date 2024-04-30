import type { GenericObject } from "../type";
import type { Call, Objects } from 'hotscript'

import { isPlainObject } from "../validate"

type StringIfNever<Type> = [Type] extends [never] ? string : Type;
type Paths<TObj> = StringIfNever<Call<Objects.AllPaths, TObj>>

/**
 * @description Flattens an object into a single level object.
 * @author grantguo
 * @date 2024-04-30 09:38:54
 * 
 * @example
 * const obj = { a: { b: 2, c: [{ d: 3 }, { d: 4 }] } };
 * flatKeys(obj);
 * // => { 'a.b': 2, 'a.c[0].d': 3, 'a.c[1].d': 4 }
 * 
*/

export function flatKeys<TObj extends GenericObject>(obj: TObj): Record<Paths<TObj>, unknown> {
  const flatObject: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    addToResult(key, value, flatObject)
  }
  return flatObject
}

function addToResult(prefix: string, value: unknown, flatObject: Record<string, unknown>) {
  if (isPlainObject(value)) {
    const flatObj = flatKeys(value)
    for (const [flatKey, flatValue] of Object.entries(flatObj)) {
      flatObject[`${prefix}.${flatKey}`] = flatValue
    }
  } else if (Array.isArray(value)) {
    for (const [index, element] of value.entries()) {
      addToResult(`${prefix}[${index}]`, element, flatObject)
    }
  } else {
    flatObject[prefix] = value
  }
}