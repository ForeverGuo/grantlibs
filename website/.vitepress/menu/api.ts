/**
 * @description api 基础使用
 * @author grantguo
 * @date 2024-03-07 17:56:01
*/
export const apiMenu = [
  {
    text: '日历calendar',
    link: '/api/calendar/index'
  },
  {
    text: '正则匹配test',
    link: '/api/check/index'
  },
  {
    text: '克隆clone',
    link: '/api/clone/index'
  },
  {
    text: '存储store',
    link: '/api/store/index'
  },
  {
    text: '身份证idCard',
    link: '/api/idCard/index'
  },
  {
    text: '发布订阅subscribe',
    link: '/api/eventEmitter/index'
  },
  {
    text: '防抖debounce',
    link: '/api/function/debounce'
  },
  {
    text: '节流throttle',
    link: '/api/function/throttle'
  },
  {
    text: '判断boolean',
    collapsed: true,
    items: [
      {
        text: 'isObject',
        link: '/api/boolean/isObject'
      },
      {
        text: 'isPromise',
        link: '/api/boolean/isPromise'
      },
      {
        text: 'isRegexp',
        link: '/api/boolean/isRegexp'
      },
      {
        text: 'isDef',
        link: '/api/boolean/isDef'
      },
    ]
  },
  {
    text: '时间time',
    collapsed: true,
    items: [
      {
        text: 'getTime',
        link: '/api/time/time'
      },
      {
        text: 'getHour',
        link: '/api/time/hour'
      },
      {
        text: 'getMinute',
        link: '/api/time/minute'
      },
      {
        text: 'getSecond',
        link: '/api/time/second'
      }
    ]
  },
  {
    text: '数组array',
    collapsed: true,
    items: [
      {
        text: 'sort',
        link: '/api/array/sort'
      },
      {
        text: 'unique',
        link: '/api/array/unique'
      },
      {
        text: 'chunk',
        link: '/api/array/chunk'
      },
      {
        text: 'count',
        link: '/api/array/count'
      },
      {
        text: 'difference',
        link: '/api/array/difference'
      },
      {
        text: 'group',
        link: '/api/array/group'
      },
      {
        text: 'move',
        link: '/api/array/move'
      },
    ]
  }
]