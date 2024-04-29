/**
 * @description 校验手机号
 * @author grantguo
 * @date 2024-04-28 17:53:19
*/
export function isMobile(mobile: string): boolean {
  const reg = /^[1]([3-9])[0-9]{9}$/;
  return reg.test(mobile);
}