/**
 * @description 校验有效车牌号
 * @author grantguo
 * @date 2024-04-28 17:55:11
*/
export function isPlate(plate: string): boolean {
  // 车牌号正则表达式（新能源车牌、普通车牌）
  const reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;

  // 检查车牌号格式
  return reg.test(plate);
}