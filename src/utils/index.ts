// 是否是偶数
export const isEven = (num: number): boolean => {
  return num % 2 === 0
}

// 是否是奇数
export const isOdd = (num: number): boolean => {
  return num % 2 === 1
}

// 是否相同类型
export const isSameType = (a: unknown, b: unknown): boolean => {
  return Object.prototype.toString.call(a) === Object.prototype.toString.call(b)
}

