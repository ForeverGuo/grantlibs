/**
 * 浅拷贝
 * @param T 泛型
 * @return Object 对象
 */
export function shallow<T>(obj: T): T {
  return Object.assign({}, obj)
}