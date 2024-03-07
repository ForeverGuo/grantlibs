class Check {
  constructor() { }
  // 校验手机号
  mobile(mobile: string): boolean {
    const reg = /^[1]([3-9])[0-9]{9}$/;
    return reg.test(mobile);
  }

  // 校验邮箱
  email(email: string): boolean {
    const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return reg.test(email);
  }

  // 校验身份证
  idCard(idCard: string): boolean {
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

  // 校验车牌号
  plate(plate: string): boolean {
    // 车牌号正则表达式（新能源车牌、普通车牌）
    const reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;

    // 检查车牌号格式
    return reg.test(plate);
  }
}

export const test = new Check()
