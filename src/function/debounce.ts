/**
 * 防抖
 * @param func 需要执行的函数
 * @param wait 延迟时间
 */
export function debounce<A extends Array<any>, R = void>(
  func: (..._args: A) => R,
  wait: number,
): Function {
  let timeOut: null | any;
  let args: A;
  function debounce(..._args: A) {
    args = _args;
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = null;
    }
    return new Promise<R>((resolve, reject) => {
      timeOut = setTimeout(async () => {
        try {
          const result = await func.apply(null, args);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }, wait);
    });
  }
  //取消
  debounce.cancel = function () {
    if (!timeOut) return;
    clearTimeout(timeOut);
    timeOut = null;
  }
  //立即执行
  debounce.flush = function () {
    debounce.cancel();
    return func.apply(null, args);
  }
  return debounce;
}