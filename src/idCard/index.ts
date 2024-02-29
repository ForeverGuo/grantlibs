import { isEven } from "../utils";
class IdCard {
  constructor() {}

  //获取出生年月
  birthday(idCard: string): string | null {
    // 身份证号码正则表达式（18位）
    const reg = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|30|31)\d{3}[0-9Xx]$/;
    
    // 检查身份证号码格式
    if (!reg.test(idCard)) {
      return null;
    }
  
    // 从身份证号码中提取出生年月
    const year = idCard.substring(6, 10);
    const month = idCard.substring(10, 12);
    const day = idCard.substring(12, 14);
  
    return `${year}-${month}-${day}`;
  }

  // 获取性别
  sex(idCard: string): string{
    const num = Number(idCard.slice(-2, -1))
    return isEven(num) ? '女性' : '男性'
  }
}

export default new IdCard()