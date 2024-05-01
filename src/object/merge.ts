import { GenericObject, ArrayMinLength, PlainObject } from "../type";
import { isPlainObject } from "../validate";

export function merge<TTarget extends GenericObject, TSources extends ArrayMinLength<GenericObject, 1>>(
  target: TTarget,
  ...sources: TSources
): MergeDeepObjects<[TTarget, ...TSources]> {
  const targetCopy = { ...target }
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      (targetCopy as PlainObject)[key] = isPlainObject(value) && isPlainObject(targetCopy[key])
        ? merge(targetCopy[key], value)
        : value
    }
  }
  return targetCopy as MergeDeepObjects<[TTarget, ...TSources]>
}

type OptionnalPropertyNames<T> =
  { [K in keyof T]-?: (PlainObject extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
  { [P in K]: L[P] | Exclude<R[P], undefined> }

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
  & Pick<L, Exclude<keyof L, keyof R>>
  & Pick<R, Exclude<keyof R, OptionnalPropertyNames<R>>>
  & Pick<R, Exclude<OptionnalPropertyNames<R>, keyof L>>
  & SpreadProperties<L, R, OptionnalPropertyNames<R> & keyof L>
>

type MergeDeepObjects<A extends readonly [...unknown[]]> = A extends [infer L, ...infer R] ?
  SpreadTwo<L, MergeDeepObjects<R>> : unknown;




