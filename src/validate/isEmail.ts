/**
 * @description 校验有效邮箱
 * @author grantguo
 * @date 2024-04-28 17:54:26
*/
export function isEmail(email: string): boolean {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return reg.test(email);
}