
type JsonifiableObject = { [key in string]?: Jsonifiable } | { toJSON: () => Jsonifiable }
type JsonifiableArray = readonly Jsonifiable[];
type JsonifiablePrimitive = string | number | boolean | null

/** @example
* ```typescript
* const error: Jsonifiable = {
*     map: new Map([['a', 1]]),
* };
* // => TypeError: Map is not a valid JSON value.
* 
* JSON.stringify(error);
* // => {"map": {}}
* 
* const good: Jsonifiable = {
*     number: 3,
*     date: new Date(),
*     missing: undefined,
* }
* 
* JSON.stringify(good);
* //=> {"number": 3, "date": "2022-10-17T22:22:35.920Z"}
* ```
*/

export type Jsonifiable = JsonifiableObject | JsonifiableArray | JsonifiablePrimitive;