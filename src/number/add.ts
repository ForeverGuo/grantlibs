/**
 * @description 两数相加
 * @author grantguo
 * @date 2024-06-06 19:41:12
 * 
 * @example
 * 
 * add(1, 2) // => 3
 * add(0.1, 0.2) // => 0.3
 * add(0.1, 0.12) // => 0.22
*/

export function add(a: number, b: number): number {
  const astr: string = a.toString()
  const bstr: string = b.toString()

  let alen: number = 0, blen: number = 0, result: number = 0;

  let pointlen = 0; // 小数点长度

  if (astr.includes('.')) {
    alen = astr.split('.')[1].length;
  }

  if (bstr.includes('.')) {
    blen = bstr.split('.')[1].length;
  }

  if (alen || blen) {
    let nums = 1;
    pointlen = alen >= blen ? alen : blen;
    for (let z = 0; z < pointlen; z++) {
      nums = nums * 10;
    }
    a = a * nums;
    b = b * nums;
  }

  result = a + b;

  // 小数点长度
  if (pointlen) {
    let s, y = [];
    for (let z = 0; z < pointlen; z++) {
      y.unshift(result % 10);
      s = result = Number((result / 10).toString().split('.')[0]);
    }
    const point = y.join('')
    return Number(`${s}.${point}`);
  }

  return result;
}


