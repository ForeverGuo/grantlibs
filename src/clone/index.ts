interface loopType {
  parent: Object;
  key: string;
  data: Object;
}
// 可遍历类型
const arrType = '[object Array]';
const objType = '[object Object]';
const mapType = '[object Map]';
const setType = '[object Set]';
const argType = '[object Arguments]';

// 不可遍历
const boolType = '[object Boolean]';
const numType = '[object Number]';
const strType = '[object String]';
const dateType = '[object Date]';
const errType = '[object Error]';
const regexpType = '[object Regexp]';
const symbolType = '[object Symbol]';
const funType = '[object Function]';

// 将可遍历类型做个集合
const traverseTypes: string[] = [arrType, objType, mapType, setType, argType];
class Clone {
  constructor() { }
  // 判断是否是对象类型
  isObject(obj: any): boolean {
    const type = typeof obj;
    return obj !== null && (type == 'object' || type === 'function')
  }
  // 获取对象类型
  getObjectType(obj: Object): string {
    return Object.prototype.toString.call(obj)
  }
  // 克隆正则类型数据
  cloneRegexp(obj: any) {
    const {
      resource,
      flags,
      lastIndex
    } = obj;
    const obj_ = new RegExp(resource, flags);
    obj_.lastIndex = lastIndex;
    return obj_;
  }
  cloneOtherType(obj: any, type: string) {
    switch (type) {
      case boolType:
      case numType:
      case strType:
      case dateType:
        return new obj.constructor(obj.valueOf());
      case symbolType:
        return Object(obj.valueOf());
      case regexpType:
        return this.cloneRegexp(obj);
      case funType:
        return obj;
    }
  }
  // 深拷贝
  deep(obj: any, map = new Map()): any {
    // 如果不是对象直接返回
    if (!this.isObject(obj)) return obj;

    const objType = this.getObjectType(obj)

    let obj_: any;
    if (traverseTypes.includes(objType)) {
      // 如果是可遍历类型，直接创建空对象
      obj_ = new obj.constructor()
    } else {
      // 如果不是，则走额外的处理
      return this.cloneOtherType(obj, objType)
    }
    // 解决循环引用
    if (map.has(obj)) {
      return map.get(obj)
    }
    map.set(obj, obj_)
    //拷贝set
    if (objType === setType) {
      obj.forEach((val: any, key: any) => {
        obj_.add(this.deep(val, map))
      })
      return obj_
    }
    // 拷贝map
    if (objType === mapType) {
      obj.forEach((val: any, key: any) => {
        obj_.set(key, this.deep(val, map))
      })
      return obj_
    }
    // 如果是数组 或者 {}
    for (let i in obj) {
      obj_[i] = this.deep(obj[i], map)
    }

    return obj_
  }
  // 浅拷贝
  shallow<T>(obj: T): T {
    return Object.assign({}, obj)
  }
}

export const clone = new Clone()
