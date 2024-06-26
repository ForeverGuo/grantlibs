/**
 * @description 有效身份证
 * @author grantguo
 * @date 2024-04-28 09:55:20
*/

export function isCard(card: string): boolean {
  let cardNo = card
  const len = cardNo.length

  if (len === 15) {
    cardNo = convert15To18(cardNo)
  }
  return validate18IdCard(cardNo)
}

function convert15To18(idCard: string): string | null {
  if (idCard.length !== 15) {
    return null; // 如果不是15位身份证号码，返回null
  }

  const id17: string = idCard.substring(0, 6) + "19" + idCard.substring(6); // 在出生年份前加上"19"
  const power: number[] = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
  const checkCode: string[] = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; // 校验码对应值
  let sum: number = 0;

  for (let i = 0; i < 17; i++) {
    sum += Number(id17.charAt(i)) * power[i];
  }

  const mod: number = sum % 11;
  const checkBit: string = checkCode[mod];

  return id17 + checkBit; // 返回18位身份证号码
}

function validate18IdCard(idNumber: string): boolean {
  // 正则表达式匹配身份证号码的规则
  const pattern = /^\d{17}[\dXx]$/;

  if (!pattern.test(idNumber)) {
    return false;
  }

  // 加权因子
  const weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验位
  const checkCodeList = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  // 计算校验位
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += Number(idNumber[i]) * weightFactor[i];
  }
  const mod = sum % 11;
  const checkCode = checkCodeList[mod];

  // 校验校验位
  if (idNumber[17].toUpperCase() === checkCode) {
    return true;
  } else {
    return false;
  }
}


// 校验身份证
export function t_idCard(idCard: string): boolean {
  // 身份证号码正则表达式（18位）
  const reg = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|30|31)\d{3}[0-9Xx]$/;

  // 检查身份证号码格式
  if (!reg.test(idCard)) {
    return false;
  }

  // 校验身份证最后一位校验码
  const checkCode = (idCard: string): boolean => {
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkList = '10X98765432';
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard.charAt(i)) * factor[i];
    }
    const mod = sum % 11;
    const lastChar = idCard.charAt(17).toUpperCase();
    return lastChar === checkList[mod];
  };

  return checkCode(idCard);
}