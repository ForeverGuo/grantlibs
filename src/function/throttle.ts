/**
 * 节流
 * @param func 需要执行的函数
 * @param wait 延迟时间
 */
type ReFn = (...args: any) => void;
type TeFn = (fn: ReFn, wait: number) => ReFn

export function throttle<A extends Array<any>, R = void>(
  func: (...args: A) => R,
  wait: number
): Function {
  let startTime: number = +new Date()
  return (...args: A) => {
    let endTime: number = +new Date()
    if (endTime - startTime >= wait) {
      func.apply(null, args)
      startTime = endTime
    } else {
      return
    }
  }
}
